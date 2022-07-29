---
title: 'Creating a .NET Cron Job for Kubernetes'
pubDate: '2022-07-29T15:29:02.384Z'
description: 'How to create a .NET 6 Cron Job with C# running in a Kubernetes Cluster'
featuredImage: '/content/blog/kubernetes-cron-job/clock-inner-gears.jpg'
layout: '../../layouts/BlogPost.astro'
---

Often times, we need to run tasks on a schedule, and often these tasks are long running, but we don't want to leave an application running all the time to work on a schedule. Often in Linux, sysadmins configure crontabs to achieve this, running a program on a specified schedule. Kubernetes also has this construct, allowing containers to be run on a schedule as pods in the background, on any host in the cluster. In this post, I'll walk you though how to create a background task with C# and .NET 6 in Kubernetes.

## Prerequisites

- The dotnet CLI or Visual Studio 2022 installed on your machine
- Docker needs to be installed as well
- A Kubernetes environment with version >= v1.21 and kubectl access
- A container registry with write access, like ghcr.io or Docker Hub

## Getting Started

Start with creating the C# project.

### With the dotnet CLI

If you're using Visual Studio, skip to the section [here](#with-visual-studio)

``` bash
# Create a cron job
mkdir MyCronJob
cd MyCronJob
dotnet new sln --name MyCronJob

# Create the project and add it to the solution
dotnet new console --output ./MyCronJob
dotnet sln add ./MyCronJob/MyCronJob.csproj

# Run the project to build it and test it out
cd ./MyCronJob
dotnet run
```
After running you should see the following:
``` bash
Hello, World!
```

Install the nuget dependencies:
``` bash
dotnet add package Microsoft.Extensions.Hosting --version 6.0.1
dotnet add package Microsoft.VisualStudio.Azure.Containers.Tools.Targets --version 1.16.1
```

Now open your editor of choice and change/add the following files:  
  
MyCronJob/Program.cs
``` csharp
using MyCronJob;

IHost host = Host.CreateDefaultBuilder(args)
    .ConfigureServices(services =>
    {
        services.AddHostedService<Worker>();
    })
    .Build();

await host.RunAsync();
```
  
MyCronJob/Worker.cs  
``` csharp
namespace MyCronJob;

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;

    public Worker(ILogger<Worker> logger)
    {
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // while (!stoppingToken.IsCancellationRequested)
        // {
            _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
            await Task.Delay(1000, stoppingToken);
        // }
    }
}
```

MyCronJob/Dockerfile
``` docker
FROM mcr.microsoft.com/dotnet/runtime:6.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["MyCronJob/MyCronJob.csproj", "MyCronJob/"]
RUN dotnet restore "MyCronJob/MyCronJob.csproj"
COPY . .
WORKDIR "/src/MyCronJob"
RUN dotnet build "MyCronJob.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MyCronJob.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MyCronJob.dll"]
```

.dockerignore
```
**/.classpath
**/.dockerignore
**/.env
**/.git
**/.gitignore
**/.project
**/.settings
**/.toolstarget
**/.vs
**/.vscode
**/*.*proj.user
**/*.dbmdl
**/*.jfm
**/azds.yaml
**/bin
**/charts
**/docker-compose*
**/Dockerfile*
**/node_modules
**/npm-debug.log
**/obj
**/secrets.dev.yaml
**/values.dev.yaml
LICENSE
README.md
```

MyCronJob/appsettings.json
``` json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  }
}
```

Lastly, change the the project SDK in the .csproj file to be the worker service SDK. You can find this at the very top of the file:
``` xml
<Project Sdk="Microsoft.NET.Sdk.Worker">
```

### With Visual Studio
If you have already created your project with the CLI, you can skip ahead to [here](#kubernetes-things).

Open the Visual Studio Launcher and click "Create a new project":  
![visual studio launcher dialog](/content/blog/kubernetes-cron-job/vs-create-step.jpg)  
Then search for and select the Worker Service project template:  
![visual studio project template selection](/content/blog/kubernetes-cron-job/vs-slect-worker-service.jpg)  
Set the project name to MyCronJob:  
![visual studio setting project name](/content/blog/kubernetes-cron-job/vs-set-project-name.jpg)  
Selecct .NET 6 as a runtime and also enable Docker support:  
![visual studo setting runtime and container support](/content/blog/kubernetes-cron-job/vs-select-project-settings.jpg)  

Make sure you comment out the lines in this file so your cron job actually exits and doesn't run in an infinite loop:  
  
MyCronJob/Worker.cs  
``` csharp
namespace MyCronJob;

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;

    public Worker(ILogger<Worker> logger)
    {
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // while (!stoppingToken.IsCancellationRequested)
        // {
            _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
            await Task.Delay(1000, stoppingToken);
        // }
    }
}
```

## Kubernetes Things

You now have a fully featured .NET worker service ready to go! Now we need to add our configuration files that tell Kubernetes how to run our cron job. I like to place my config file for Kubernetes in the root of my project along side my Dockerfile. If you need to build a new schedule you can use this tool at [crontab.guru](https://crontab.guru/).

MyCronJob/kube.yml
``` yaml
kind: CronJob
metadata:
  name: mycronjob
spec:
  schedule: "*/5 * * * *" # Runs every 5 minutes
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: mycronjob
            image: << registry url (we'll fill this in next) >>
            env:
          restartPolicy: OnFailure
```

## Building and Pushing our Container

Now we need to have Docker build our container and we need to push it to our repository. At this point, make sure your Docker install is logged into your registry provider. In practice, these builds and pushes would be handled as part of a CI pipeline. This reduces the amount of manual work you have to do locally when pushing out code changes and would standardize the process for deploying so all build tags are in the correct sequential order and that they make sense. I'll probably cover setting up one of these pipelines in Azure DevOps in a future blog post. For the sake of this article though, we'll just build and push from our local machine to get up and running.

Lets get started with building the project. Open a terminal and ```cd``` into the root of the solution. Then run the following to start the Docker build of your cron job: 
``` bash
docker build . -f ./MyCronJob/Dockerfile -t mycronjob:latest
```
Then go ahead and test it by running the container image:
``` bash
docker run -it mycronjob:latest
```
You should see something like this: 
``` bash
info: MyCronJob.Worker[0]
      Worker running at: 07/29/2022 21:51:43 +00:00
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
info: Microsoft.Hosting.Lifetime[0]
      Hosting environment: Production
info: Microsoft.Hosting.Lifetime[0]
      Content root path: /app
info: MyCronJob.Worker[0]
      Worker running at: 07/29/2022 21:51:44 +00:00
...
```
Press Ctrl+C to stop it from running. Now to push the container to your registry:
```bash
docker image push --all-tags my-registry-host/mycronjob:latest
```
Make sure to replate the text ```my-registry-host``` with your registry, or remove it if you're using dockerhub. Now, replace the line in your ```kube.yml``` file with the registry reference above:
``` yaml
kind: CronJob
metadata:
  name: mycronjob
spec:
  schedule: "*/5 * * * *" # Runs every 5 minutes. Build new schedule here: https://crontab.guru/
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: mycronjob
            image: my-registry-host/mycronjob:latest # HERE
            env:
          restartPolicy: OnFailure
```
## Deploying to Kubernetes
We now have a .NET Cron job built, and we have it pushed up to a container image registry. Now, we do the final step, we need to deploy the manifest file to kubernetes. Make sure you have ```kubectl``` set up and working on your machine and then run the following command to deploy the job configuration:
``` bash
kubectl create -f ./MyCronJob/kube.yml
```
Then, wait at least 5 minutes for the job to run, and then verify that the cron job is deployed:
``` bash
ben@mynode1:~$ kubectl get cronjobs
NAME                               SCHEDULE       SUSPEND   ACTIVE   LAST SCHEDULE   AGE
mycronjob                          */5 * * * *    False     0        2m3s            176d
```
Then lets get the list of pods in the namespace:
``` bash
ben@mynode1:~$ kubectl get pods
NAME                                                   READY   STATUS      RESTARTS       AGE
... truncated ...
mycronjob-27652200-7blsn                               0/1     Completed   0              18m
```
Then grab the logs from the pod to verify it ran:
```
ben@mynode1:~$ kubectl logs mycronjob-27652200-7blsn
.... logs like above ....
info: MyCronJob.Worker[0]
      Worker running at: 07/29/2022 21:51:43 +00:00
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
info: Microsoft.Hosting.Lifetime[0]
      Hosting environment: Production
info: Microsoft.Hosting.Lifetime[0]
      Content root path: /app
info: MyCronJob.Worker[0]
      Worker running at: 07/29/2022 21:51:44 +00:00
...
```

## Conclusion
If you've made it this far, you've created a .NET Cron Job and scheduled it to run within Kubernetes! Using this project framework, you can set up this job to do anything you'd like on a schedule. You can also take this framework and implement a CI/CD pipeline around it for easy automated deployments. As I stated above, I'll probably have a blog post soon covering the process of implementing that with Azure DevOps. As usuall, if there's something wrong, or you even just have questions or suggestions for this blog post, please don't hesitate to submit an issue [here](https://github.com/moutansos/benbrougher-tech) on Github.