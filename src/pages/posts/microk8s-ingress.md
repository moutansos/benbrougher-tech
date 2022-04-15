---
title: 'Kubernetes Ingress with microk8s, MetalLB, and the NGINX Ingress Controller'
date: '2022-04-14T21:46:02.384Z'
description: 'How to use microk8s to create an ingress using MetalLB and the NGINX ingress controller'
featuredImage: '/content/blog/microk8s-ingress/front-door.jpg'
layout: '../../layouts/BlogPost.astro'
---

## What's an Ingress?

In Kubernetes, there are many running services at any given time. These may even be microservices representing indiviual domains of your application, but when it comes time to call these services from a frontend application, having all these services run on separate IP addresses and subroutes can lead to a management nightmare. What if the cluster is being redeployed on a different subnet and all the load balancer IP addresses are changing? Or what if the cluster is moving to a different cloud provider? All the individual DNS entries pointing to the services within the cluster would need to change. You may also want to run all your network traffic off a single IP address for multiple domain names. The answer to all these problems is a Kubernetes concept called an Ingress. An Ingress tells kubernetes how to take traffic from the outside world and route it to the proper service.  
  
You might ask however: "What about service load balancers and API gateways?" Historically, we've used API gateways (such as Ocelot, or Kong) to consolidate individual APIs into a single interface that our frontend can talk to. Ingress' provide a way to define in a semi-vendor neutral way, how traffic should flow. You can specify host names, and within those hosts you can specify sub routes and have the Ingress route traffic to different services via the same host name. For example, you may have:
```
www.mystore.com => Container hosting a static site
api.mystore.com
    /cart => Cart Managment Service
    /orders => Order Management Service
    /products => Product Management Service
```
All these different routes can be served by a single IP address via an Ingress rule. You can have any depth or format to the routes specified. In reality though, an Ingress is just a rule that lives in Kubernetes to define what the traffic should do. It doesn't actually handle routing the traffic, that is left to the Ingress Controller.

## Ingress Controllers

An Ingress Controller is a type of resource in Kubernetes that actually does the heavy lifting in regards to routing traffic. These controllers are oftent times built out of already existing server applications like NGINX, Traefik, or HAProxy. There are even Ingress Controllers that will handle advanced use cases like Istio, which allows running serverless functions and facilitates scaling your pods to zero when there are no requests being made. In this post, we will be using microk8s as a base cluster. We'll extend the cluster with the MetalLB and NGINX Ingress addons. 

## How to Set Up an Ingress

Prerequisites:  
- A fully working microk8s instance. You can use the documentation [here](https://microk8s.io/docs/getting-started) to set up and configure the cluster. Any size will do, even a single node cluster for testing.
- Knowlege of the IP subnet the cluster is running on. This will be important for defining the address range for MetalLB to use for our Ingress. For example, my cluster runs on my homelab network on the 192.168.1.x subnet.

### Enabling MetalLB
### Enabling the Ingress
### Deploying Test Services
### Configuring the Ingress Record
### Configuring the Load Balancer Service
### Testing
## Conclusion