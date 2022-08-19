---
title: 'Switching to microk8s - 6 Months Later'
pubDate: '2022-08-18T22:23:02.384Z'
description: 'How the move from kubeadm to microk8s has worked out over the last 6 months'
layout: '../../layouts/BlogPost.astro'
---

It was about 6 months ago when as a team at the company I work for, we decided to switch from a kubeadm-based cluster to a microk8s-based one. The maintenance time on weekends spent upgrading and fixing kubeadm was just too high. As a dev team, we wanted a lower maintenance solution without the added complexity of moving workloads to a cloud-based solution. I also switched my home lab cluster to be based on microk8s for testing and learning purposes. After 6 months, there have been some ups and downs with moving, so I wanted to outline them here.

## The Pros
There have been quite a few things that we've been happy with.

### The Install Process
Installation, compared to kubeadm is a breeze. Just spin up an ubuntu server, run the commands to install the snap for the Kubernetes version you want, generate a join command, run that on the other servers, and you have a cluster. Then install the pre-curated add-ons to your needs with simple commands and it all just works. You also don't need a load balancer for kube api server, the cluster manages all that internally.

### Stability
One of the best things that came from switching has been stability. With kubeadm, especially early on, there would be mornings when I would come into work and would find the cluster in a broken state. It was almost always due to transient network issues and etcd getting corrupted and not handling the situation properly. In microk8s, etcd is replaced with a purpose-built distributed database called dqlite. Its main benefit for us has been stability in the face of transient network issues. It also manages hot spares and replicas within itself, unlike etcd which has to be managed by the administrator and the proper number of replicas has to be maintained based on the raft algorithm. It's one less thing we need to worry about.  

### Ease of Upgrades
Another pro has been the ease of upgrades. Because microk8s is distributed via snap packages, the distribution handles minor upgrades automatically. This means that any minor upgrades are hands-off and seamless. For major upgrades, it's as simple as changing the snap channel node by node and waiting for each to show up as ready.

### Ease of Backup and Restore
The final big win is the fact that microk8s has its own built-in backup and restore tools. There's no worrying about backing up etcd and configuring the etcd CLI tools, it makes the process seamless.

## The Cons
Nothing's perfect. These are the things that weren't perfect about the experience.

### Where do I point kubectl?
Because of the more resilient and distributed nature of the dqlite database underneath, and because microk8s by default runs an API server on each node, a network load balancer isn't necessary. This is one less moving part, but it also means pointing kubectl at only one of the nodes, which means if the node goes down, you have to repoint the kubectl config at a working node.

### DNS has been an issue
Also, the default DNS configuration setup seems to have some issues. It defaults to 8.8.8.8 instead of using each node's DNS configuration, which means by default no local network names resolve. If it used DHCP by default then this wouldn't be an issue.

## Conclusion
Overall, the experience of using microk8s has been great. It's been a big win for maintainability and stability. There are a few minor annoyances or gotchas but those are far overshadowed by the benefits.