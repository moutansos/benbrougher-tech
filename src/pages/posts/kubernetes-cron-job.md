---
title: 'Creating a .NET Cron Job for Kubernetes'
pubDate: '2022-07-15T21:46:02.384Z'
description: 'How to create a .NET 6 Cron Job with C# running in a Kubernetes Cluster'
featuredImage: '/content/blog/kubernetes-cron-job/clock-inner-gears.jpg'
layout: '../../layouts/BlogPost.astro'
# setup: |
#     import Test from "../../components/Test.svelte";
---

Often times, we need to run tasks on a schedule, and often these tasks are long running, but we don't want to leave an application running all the time to trigger on a schedule. Often in Linux, sysadmins configure crontabs to achieve this, running a program on a specified schedule. Kubernetes also has this construct, allowing containers to be run on a schedule as pods in the background, on any host in the cluster. In this post, I'll walk you though how to create a background task with C# and .NET 6 in Kubernetes.

## Prerequisites

- The dotnet CLI or Visual Studio 2022 installed on your machine
- A Kubernetes environment with version >= v1.21 and kubectl access
- A container repository, like ghcr.io or Docker Hub

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
        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
            await Task.Delay(1000, stoppingToken);
        }
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

MyCronJob/.dockerignore
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

Open the Visual Studio Launcher and click "Create a new project":  
![visual studio launcher dialog](/content/blog/kubernetes-cron-job/vs-create-step.jpg)  
Then search for and select the Worker Service project template:  
![visual studio project template selection](/content/blog/kubernetes-cron-job/vs-slect-worker-service.jpg)  
Set the project name to MyCronJob:  
![visual studio setting project name](/content/blog/kubernetes-cron-job/vs-set-project-name.jpg)  
Selecct .NET 6 as a runtime and also enable Docker support:  
![visual studo setting runtime and container support](/content/blog/kubernetes-cron-job/vs-select-project-settings.jpg)  

## Kubernetes Things

You now have a fully featured .NET worker service, ready to go! Now we need to add our configuration files that tell Kubernetes how to run our cron job. I like to place my config file for Kubernetes in the root of my project along side my Dockerfile.

MyCronJob/kube.yml
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
            image: << registry url (we'll fill this in next) >>
            env:
          restartPolicy: OnFailure
```

