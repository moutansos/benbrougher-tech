---
title: 'Switching to microk8s - 6 Months Later'
pubDate: '2022-08-15T23:34:03.231Z'
description: 'How the move from kubeadm to microk8s has worked out over the last 6 months'
featuredImage: '/content/blog/microk8s-6-months-later/TODO.jpg'
layout: '../../layouts/BlogPost.astro'
---

It was about 6 months ago, when as a team at the company I work for, we decided to switch from a kubeadm based cluster to a microk8s based one. The maintenence time on weekends spent upgrading and fixing kubeadm were just too high. As a dev team, we wanted a lower maintenence solution without the added complexity of moving workloads to a cloud based solution. I also switched my home lab cluster to be based on microk8s for testing and learning purposes. After 6 months, there have been some ups and downs with moving, so I wanted to outline them here.

## The Pros
There have been quite a few things that we've been happy with.

### The Install Process
Installation, compared to kubeadm is a breeze. Just spin up an ubuntu server, run the commands to install the snap for the kubernetes version you want, generate a join command, run that on the other servers, and you have a cluster. Then install the pre-curated addons to your needs with simple commands and it all just works. You also don't need a load balancer for kube api server, the cluster manages all that internally.

### Stability
To start, one of the best things that have come from switching has been stability. With kubeadm, especialy early on, there would be mornings when I would come in to work and would find the cluster in a broken state. It was almost always due to transient network issues and etcd getting corrupted and not handling the situation properly. In microk8s, etcd is replaced with a purpose built distributed database called dqlite. It's main benifit for us has been stability in the face of transient network issues. It also manages hot spares and replicas within itself, unlike etcd which has to be managed by the administrator and the proper number of replicas have to be maintained based on the raft algorithm. It's one less thing we need to worry about.  

### Ease of Upgrades

## The Cons

### Where do I point kubectl?

### DNS has been an issue

## Conclusion
