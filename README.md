API Reference
======
Courses
------
| Route                                  | HTTP Verb | Description                                         |
|----------------------------------------|-----------|-----------------------------------------------------|
| /api/courses                           | GET       | Get all courses                                     |
| /api/courses/:courseId                 | GET       | Get a course by courseId                            |
| /api/courses                           | POST      | Create a course                                     |

Posts
------
| Route                                  | HTTP Verb | Description                                         |
|----------------------------------------|-----------|-----------------------------------------------------|
| /api/courses/:courseId/posts           | GET       | Get all posts in a specific course given courseId   |
| /api/courses/:courseId/posts/:postId   | GET       | Get a specific post in a specific course            |
| /api/courses/:courseId/posts           | POST      | Create a post in a specific course                  |
| /api/courses/:courseId/posts/:postId   | PUT       | Update a post by courseId and postId                |
| /api/courses/:courseId/posts/:postId   | DELETE    | Delete a post by courseId and postId                |
| /api/courses/:courseId/posts/          | DELETE    | Delete all posts in a specific course               |


Comments
------
| Route                                  | HTTP Verb | Description                                                 |
|----------------------------------------|-----------|-------------------------------------------------------------|
| /api/posts/:postId/comments            | POST      | Create a comment by postId __(data: content)__              |
| /api/posts/:postId/comments/:commentId | PUT       | Update a comment by postId + commentId __(data: content)__  |
| /api/posts/:postId/comments/:commentId | DELETE    | Delete a comment by postId + commentId                      |
