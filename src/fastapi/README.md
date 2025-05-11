# Deploy FastAPI on Render

Use this repo as a template to deploy a Python [FastAPI](https://fastapi.tiangolo.com) service on Render.

See https://render.com/docs/deploy-fastapi or follow the steps below:

## Manual Steps

1. You may use this repository directly or [create your own repository from this template](https://github.com/render-examples/fastapi/generate) if you'd like to customize the code.
2. Create a new Web Service on Render.
3. Specify the URL to your new repository or this repository.
4. Render will automatically detect that you are deploying a Python service and use `pip` to download the dependencies.
5. Specify the following as the Start Command.

    ```shell
    uvicorn main:app --host 0.0.0.0 --port $PORT
    ```

6. Click Create Web Service.

Or simply click:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/render-examples/fastapi)

## Thanks

Thanks to [Harish](https://harishgarg.com) for the [inspiration to create a FastAPI quickstart for Render](https://twitter.com/harishkgarg/status/1435084018677010434) and for some sample code!

### Path parameter:
http://localhost:8000/get_transcript/abc123/en 
(to identify specific resources, i.e. /cars)

### Query parameter:
http://localhost:8000/get_transcript/?video_id=abc123&lang=en
(sort/filter resources, i.e. /cars?color=red)

### API Reference:
[YouTube Transcript API](https://pypi.org/project/youtube-transcript-api/)

### Steps to run the server:

0. Create a virtual environment:
    ```bash
    python3 -m venv <ENV_NAME>
    ```
    (Skip if you already have an `env` folder)

1. In terminal, run:
    ```bash
    source <ENV_NAME>/bin/activate
    ```
    (Type `deactivate` to exit)

2. Install dependencies:
    ```bash
    pip install fastapi
    pip install youtube_transcript_api
    pip install "fastapi[standard]"
    ```

3. Start the server:
    ```bash
    fastapi dev main.py
    ```
