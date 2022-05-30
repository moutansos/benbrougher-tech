---
title: 'Kubernetes Ingress with microk8s, MetalLB, and the NGINX Ingress Controller'
date: '2022-04-14T21:46:02.384Z'
description: 'How to use microk8s to create an ingress using MetalLB and the NGINX ingress controller'
featuredImage: '/content/blog/microk8s-ingress/front-door.jpg'
layout: '../../layouts/BlogPost.astro'
---

## What's an Ingress?

In Kubernetes, there are many running services at any given time. These may be microservices representing indiviual domains of your application, but when it comes time to call these services from a frontend application having them run on separate IP addresses and subroutes can lead to a management nightmare. What if the cluster is being redeployed on a different subnet and all the load balancer IP addresses are changing? Or what if the cluster is moving to a different cloud provider? All the individual DNS entries pointing to the services within the cluster would need to change. You may also want to run all the network traffic through a single IP address for multiple domain names. The answer to all these problems is a Kubernetes object called an Ingress. An Ingress tells Kubernetes how to take traffic from the outside world and route it to the proper service. 

You might ask, however: "What about service load balancers and API gateways?" Historically, API gateways are used (such as Ocelot, or Kong) to consolidate individual APIs into a single interface that our frontend can talk to. Ingress' provide a way to define in a semi-vendor neutral way, how traffic should flow. You can specify host names, and within those hosts you can specify sub routes and have the Ingress route traffic to different services via the same host name. For example, you may have:

```
www.mystore.com => Container hosting a static site
api.mystore.com
    /cart => Cart Managment Service
    /orders => Order Management Service
    /products => Product Management Service
```

All these different routes can be served by a single IP address via an Ingress rule. You can have any depth or format to the routes specified. In reality though, an Ingress is just a rule that lives in Kubernetes to define what the traffic should do. It doesn't actually handle routing the traffic, that is left to the Ingress Controller.

## Ingress Controllers

An Ingress Controller is a type of resource in Kubernetes that actually does the heavy lifting in regards to routing traffic. These controllers are often built out of already existing server applications like NGINX, Traefik, or HAProxy. There are even Ingress Controllers that will handle advanced use cases like Istio, which allows running serverless functions and facilitates scaling your pods to zero when there are no requests being made. In this post, we will be using microk8s as a base cluster. We'll extend the cluster with the MetalLB and NGINX Ingress addons.

## How to Set Up an Ingress

Prerequisites:

- A fully working microk8s instance. You can use the documentation [here](https://microk8s.io/docs/getting-started) to set up and configure the cluster. Any size will do, even a single node cluster for testing.
- Knowlege of the IP subnet the cluster is running on. This will be important for defining the address range for MetalLB to use for our Ingress. For example, my cluster runs on my homelab network on the 192.168.1.x subnet.

### Enabling MetalLB

Enabling MetalLB on microk8s is extremely easy. The microk8s stack has a concept of addons that can be enabled to easily give your cluster common functionality. The first step is to identify a range of IP addresses that will be allocatable by MetalLB. For this example, I'll use `192.168.1.200-192.168.1.220`. These IP adresses must be on the same subnet where the cluster is located. After you have the IP range, log into one of your nodes, and enable the load balancer like this:

```bash
microk8s enable metallb:192.168.1.200-192.168.1.220
```

You can read more about the microk8s addon [here](https://microk8s.io/docs/addon-metallb) and more about MetalLB [here](https://metallb.universe.tf/).

### Enabling the Ingress

Adding the ingress addon is similar to adding MetalLB. It can be enabled with the following:

```bash
microk8s enable ingress
```

You can read more about the Ingress Controller addon [here](https://microk8s.io/docs/addon-ingress).

### Deploying Test Services

Next, we will deploy a few services to provide something to reply to requests on our endpoints.

```yaml
# service-1.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: service1
spec:
  replicas: 2
  selector:
    matchLabels:
      app: service1
  template:
    metadata:
      labels:
        app: service1
    spec:
      containers:
        - name: service1
          image: ghcr.io/moutansos/helocontainers:latest
          ports:
            - name: http
              containerPort: 80
          env:
            - name: ASPNETCORE_ENVIRONMENT
              value: Development
            - name: HELLOCONTAINERS_MESSAGE
              value: 'Hello from Service 1!'
      imagePullSecrets:
        - name: ghcr-secret
      nodeSelector:
        kubernetes.io/os: linux
---
apiVersion: v1
kind: Service
metadata:
  name: service1
spec:
  ports:
    - name: http
      port: 80
      protocol: TCP
      targetPort: 80
  selector:
    app: service1
  type: ClusterIP
```

```yaml
# service-2.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: service2
spec:
  replicas: 2
  selector:
    matchLabels:
      app: service2
  template:
    metadata:
      labels:
        app: service2
    spec:
      containers:
        - name: service2
          image: ghcr.io/moutansos/helocontainers:latest
          ports:
            - name: http
              containerPort: 80
          env:
            - name: ASPNETCORE_ENVIRONMENT
              value: Development
            - name: HELLOCONTAINERS_MESSAGE
              value: 'Hello from Service 2!'
      imagePullSecrets:
        - name: ghcr-secret
      nodeSelector:
        kubernetes.io/os: linux
---
apiVersion: v1
kind: Service
metadata:
  name: service3
spec:
  ports:
    - name: http
      port: 80
      protocol: TCP
      targetPort: 80
  selector:
    app: service3
  type: ClusterIP
```

```yaml
# service-3.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: service3
spec:
  replicas: 2
  selector:
    matchLabels:
      app: service3
  template:
    metadata:
      labels:
        app: service3
    spec:
      containers:
        - name: service3
          image: ghcr.io/moutansos/helocontainers:latest
          ports:
            - name: http
              containerPort: 80
          env:
            - name: ASPNETCORE_ENVIRONMENT
              value: Development
            - name: HELLOCONTAINERS_MESSAGE
              value: 'Hello from Service 3!'
      imagePullSecrets:
        - name: ghcr-secret
      nodeSelector:
        kubernetes.io/os: linux
---
apiVersion: v1
kind: Service
metadata:
  name: service3
spec:
  ports:
    - name: http
      port: 80
      protocol: TCP
      targetPort: 80
  selector:
    app: service3
  type: ClusterIP
```

After saving these files, run:

```bash
microk8s kubectl apply -f service-1.yml
microk8s kubectl apply -f service-2.yml
microk8s kubectl apply -f service-3.yml
```

### Configuring the Ingress Record

The next step is to add the record for the ingress to point to our three services. We will place one service on its own hostname, and the other two services will share subroutes on a hostname. Here's the config to apply:

```yaml
# ingress.yml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nginx-ingress-microk8s
  labels:
    app: nginx-ingress-microk8s
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/use-forwarded-headers: "true"
spec:
  rules:
  - host: "api.mysite.net"
    http:
      paths:
      - pathType: Prefix
        path: "/"
        backend:
          service:
            name: service1
            port:
              number: 80
   - host: "api.myothersite.net/service2"
     http:
     paths:
     - pathType: Prefix
         path: "/"
         backend:
         service:
            name: service2
            port:
            number: 80
   - host: "api.myothersite.net/service3"
     http:
     paths:
     - pathType: Prefix
         path: "/"
         backend:
         service:
            name: service2
            port:
            number: 80
---
apiVersion: v1
kind: Service
metadata:
  name: ingress
  namespace: ingress
spec:
  selector:
    name: nginx-ingress-microk8s
  type: LoadBalancer
  loadBalancerIP: <<LOAD BALANCER IP HERE>>
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 80
    - name: https
      protocol: TCP
      port: 443
      targetPort: 443
```
After saving the file with your external IP specified, run the following:
``` bash
microk8s kubectl apply -f ingress.yml
```
At this point you should now have an ingress record along with a load balancer service sitting in front of the Ingress.

### Testing

We can now test the endpoints to see if they are working:
```bash
curl -H "Host: api.mysite.net" http://<<LOAD BALANCER IP HERE>>/hello
curl -H "Host: api.myothersite.net" http://<<LOAD BALANCER IP HERE>>/service2/hello
curl -H "Host: api.myothersite.net" http://<<LOAD BALANCER IP HERE>>/service3/hello
```

By specifying the ```Host``` header, we can simulate a request coming from one of those hostnames all pointed at the load balancer IP address Each one of these should return a response specifying services 1-3 all called on different routes and hostnames. 

### Conclusion

Kubernetes Ingresses and Ingress Controllers, are a powerfull tool that can help to reduce complexity externally, as well as provide a built in replacement for API gateways, and even facilitate serverless functions and auto-scaling scenarios in a cluster. 