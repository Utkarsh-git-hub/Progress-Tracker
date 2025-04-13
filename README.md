# Progress Tracker - Video Learning Platform

This project is a video learning platform that accurately tracks student progress on lecture videos by saving and updating their progress based on the unique parts of the video they have watched. The system ensures that only the truly watched parts are counted toward the progress, avoiding false increments from rewatching or skipping sections. Additionally, it includes user authentication to manage user sessions and ensure the correct tracking of progress.

## Features

- **User Authentication**: 
  - Users can sign up, log in, and log out securely using email and password.
  - Each user has a unique progress tracking system.
  
- **Video Playback with Real Progress Tracking**: 
  - The platform tracks real video progress by monitoring the unique intervals watched.
  - Progress is only increased when new, previously unwatched segments are played.
  - Skipping parts or rewatching sections will not result in inflated progress.

- **Seamless Resume from Last Watched Position**: 
  - When users return to a video, the platform resumes from where they last left off, ensuring a smooth learning experience.
  - The last watched position is saved whenever the user pauses the video or navigates away.

- **Progress Calculation**:
  - The system records the start and end times of each segment the user watches.
  - It ensures that overlapping intervals or already watched parts are not counted multiple times.
  - The total watched time is converted into a percentage based on the total length of the video.

- **Persistent Progress**: 
  - All progress details (intervals, percentage) are saved in the database and persist even after the user logs out or closes the app.
  - This allows users to return to the video at any time, and the system will resume the video from the correct point, showing the accurate progress.

## Technical Details

### Video Tracking Logic

- **Tracking Unique Intervals**: 
  - The system records the start and end timestamps of each segment watched by the user.
  - These timestamps are saved only if the user has not already watched that part of the video.
  - When a user skips to a new part of the video or watches a part again, the system compares the new timestamps with the saved intervals and ensures that only new, unwatched parts are counted toward progress.
  
- **Preventing Skipping**: 
  - If a user jumps ahead or skips sections, only the previously unwatched segments will increase the progress. The skipped time is not counted.
  
- **Progress Calculation**: 
  - After each time update, the system checks if the current segment is already recorded. If not, it adds the new segment to the list of watched intervals.
  - The progress is updated only when new content is watched. The total progress is calculated as a percentage of the total length of the video.

- **Merging Intervals**: 
  - When new intervals are recorded, they are merged with the previously watched intervals to avoid counting overlapping or rewatched segments.
  - For example, if a user watches from 0–20 seconds and later watches 10–30 seconds, the system will merge these intervals into one continuous segment of 0–30 seconds.

### User Authentication

- **Sign Up**:
  - Users can create an account with their email and password.
  - Passwords are securely hashed using bcrypt before being stored in the database.

- **Login**:
  - Users can log in using their credentials (email and password).
  - Upon successful login, the server sends back a JWT token, which is stored in local storage for session management.
  
- **Protected Routes**:
  - Certain routes, like those for saving and fetching user progress, are protected by authentication middleware, ensuring that only authenticated users can access them.

- **Session Management**:
  - When a user logs in, their progress is stored in the database, tied to their user account.
  - Upon returning to the platform, users are authenticated and their progress data is fetched based on their user session.

