---
title: Getting Started With API Development in Flask
date: "2019-09-07T22:12:03.284Z"
description: "A Guide to Starting an API With Flask and Python"
---

I am primarily a back-end .NET Core developer, so when I heard that I would perhaps soon be using python for a project at work, I knew I had to refresh my Python skills. My start in programming stemmed from playing with Python 2 in middle-school, but that has long since been forgotten when I entered the .NET and NodeJS worlds. My experience then with Python had been passing and transient at best, barely scratching the surface of the language and it's capabilities at the time. This guide is a guide with steps I followed as part of my reintroduction to Python. This is a basic guide for anyone looking to get started developing APIs with Python 3 and Flask. This tutorial assumes that you have Python 3 and PIP installed in your path. I also use PowerShell as my terminal, so the commands may be different depending on your system.

At the end of this blog post (if you are following along), you will have created a basic Hello World API in Flask.

# What is Flask?

[Flask](https://palletsprojects.com/p/flask/) is defined as:

> A lightweight WSGI web application framework.
> It is designed to make getting started quick and easy,
> with the ability to scale up to complex applications.

It can be used to create different types of web applications. Different options include legacy multi-page applications, RESTful or GraphQL APIs, or used to serve static resources. In this tutorial, we will focus on building a RESTful API.

# Setting Up a Basic Hello World API

The first goal is to do a simple GET request on our server and return the essential "Hello World!" string. This will be the start of our API.

## Project Setup

First, from the terminal, run the following commands to install flask and flask_restful via pip:

``` powershell
pip install flask
pip install flask_restful
```

Then create a new directory and a file to start our project:

``` powershell
mkdir hello-world-api
cd hello-world-api
New-Item main.py # use touch main.py on bash
```

From here open the main.py file in your editor of choice. I would highly recommend VS Code with the Python extension.

## Creating a Hello World API

The piece of code required is the imports to load the flask library and make it available in our application. In the start of your file add the following:

```python
from flask import Flask
from flask.views import MethodView
from flask_restful import Api
```

The next step is to create an instance of Flask and then an instance of our API that uses the new Flask instance. Place the following code below:

```python
app = Flask(__name__)
api = Api(app)
```

The `__name__` variable in python refers to the name of the library or module that is currently being imported. If the script is the main file in the program, it will be equal to `__main__`.

After this, we can create our controller. Initially, it will only have a single method, `get()` that will respond to get requests on our endpoint. The controller class will look something like this:

```python
class HelloWorld(MethodView):
    def get(self, id):
        msg = {
            "message": "Hello World!"
        }

        return msg, 200
```

This class defines actions that are taken when our API is called. Any logic that handles things like incoming parameters are specified here. Not only is our data object returned here, but also our HTTP status code. `200` indicates that the request was successful and everything executed as indended. For a full list of HTTP status codes and their meanings, see [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).

Next, we define our resource in our `api` object:

```python
api.add_resource(HelloWorld, "/hello/world")
```

We pass in our controller here. Also, the `<string:id>` part of the URL specified here defines a template. This template indicates that the ID of the item should be passed from the URL to a parameter in the controller (the `id`) parameter in the `get` method signature).

After this we can invoke our application via this bit of boiler-plate python code:

```python
if __name__ == "__main__":
    app.run(debug=True, threaded=True)
```

This code determines if the script is a library or if it is a running entrypoint script. If it is an entrypoint script, then the API is started and flask is run. In order to start this, in a terminal, run the following command:

```powershell
python3 .\main.py
```

> Note: Depeding on your setup you may be able to use ```python``` instead of ```python3```. 
> This depends on how the Python distribution is set up on your system.

This will start the flask application and you should see something like this:

```
 * Serving Flask app "main" (lazy loading)
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Restarting with stat
 * Debugger PIN: 197-957-841
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
```

You can now make a request to your API. Utilizing something like Postman, curl, or Invoke-WebRequest you can get the data from the API. For example:

On Linux:
``` bash
curl http://127.0.0.1:5000/hello/world
```

Or on PowerShell:
``` powershell
Invoke-WebRequest http://127.0.0.1:5000/hello/world
```

You should see a response that looks like this:

``` json
{
    "message": "Hello World!"
}
```

# Conclusion

You now have a simple working REST API! Stay tuned for how to use use REST-full Flask to it's full potential set up basic Create, Read, Update and Delete, operations, and also how to connect it to a database for storing the data in the API long term. If you find any issues with this blog, please submit a pull request on my [repo here](https://github.com/moutansos/benbrougher-tech).
