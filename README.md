[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/vfKrPwQS)
# LiveLingo
## CS 445 Final Project
### Spring, 2025

### Team: 7
Tu Dinh, Varun Dileepan, Eric Chen

## Getting Started
LiveLingo is a site that allows you to get live english translations for non-english foreign videos that has no reliable or any subtitles at all. LiveLingo allows ambitious language learners to not get roadblocked when they want to learn new sentence. Aside from getting the english translation, users can also save words to a list and be able to convert them into a flashcard deck for further studying.

### Roadmap
* Phase 2 Features: 
* Better and more stable translation API that has maintainers and subjectively more accurate translations. Specifically, we want AI to convert speech to text and use that to translate. Not restricting us to only use transcripts of videos. (This goes with our other plan to allow for more types of input)
* To allow for more types of inputs such as: video upload, other sources besides YouTube. 
* Import/Export Flashcard decks from third party applications like Anki, Quizlet. 
* More reliable syncing, as of now, our syncing functionality works on the basis of the start of each transcript item (sentences or single words). Although it may be theoretically impossible to have 1:1 syncing with the speaker’s voice.
* Better CSS overall

## SRS
[[document](https://docs.google.com/document/d/1sRP4Ddse97Gp9jGOHWNEZOgI1vFFwfzEcsBGmngrnJs/edit?usp=sharing)]
  
### Prerequisites
* [Docker](https://www.docker.com/)
* [ARML API](https://socket.dev/npm/package/arml/overview/0.0.12): 0.0.12
* [Video.js](https://videojs.com/): 8.22.0
* [BullMQ](https://docs.bullmq.io/): 5.49.1
* [Fastapi](https://fastapi.tiangolo.com/): 0.115.12
* [Youtube Transcript API](https://pypi.org/project/youtube-transcript-api/): 1.0.3
* [Langchain](https://www.langchain.com/langsmith): 0.3.45
* [Google Gemini API](https://ai.google.dev/): 0.2.4
* [MongoDB](https://www.mongodb.com/): 6.15.0
* [Mongoose](https://mongoosejs.com/docs/): 8.13.2

### Installing
Refer to [CONTRIBUTING.md](https://github.com/bucs445spring2025/portfolio-team7/blob/main/CONTRIBUTING.md)

## Built With
* [Next.js](https://nextjs.org/)
* [MongoDB](https://www.mongodb.com/)
* [Fastapi](https://fastapi.tiangolo.com/)

## License
This project is licensed under the [MIT License](LICENSE).

## Acknowledgments
* Documentation codee
* [Animelon](https://animelon.com/) for the inspiration
