API Reference
======
Handler
------
| Params                                            |HTTP Verb  | Description                                           |
|---------------------------------------------------|-----------|-------------------------------------------------------|
| courseId                                          | N/A       | find course by id and store the result in req.course  |
| postId                                            | N/A       | find post by id and store the result in req.post      |
| commentId                                         | N/A       | find comment by id and store the result in req.comment|
| userId                                         | N/A       | find user by id and store the result in req.user|

Courses
------
| Route                                             | HTTP Verb | Description                                               |
|---------------------------------------------------|-----------|-----------------------------------------------------------|
| /api/courses                                      | GET       | Get all courses                                           |
| /api/courses/user                              | GET       | Get all users in a course                              |
| /api/courses/:courseName                          | GET       | Get a course by courseName                                |
| /api/courses/:courseId                            | GET       | Get a course by courseId                                  |
| /api/courses                                      | POST      | Create a course                                           |

Posts
------
| Route                                                   | HTTP Verb | Description                                         |
|---------------------------------------------------------|-----------|-----------------------------------------------------|
| /api/courses/:courseId/posts                            | GET       | Get all posts in a specific course given courseId   |
| /api/courses/:courseId/posts/:postId                    | GET       | Get a specific post in a specific course            |
| /api/courses/:courseId/users/:userId/posts        | POST      | Create a post in a course and reference a user   |
| /api/courses/:courseId/posts/:postId                    | PUT       | Update a post by courseId and postId                |
| /api/courses/:courseId/users/:userId/posts/:postId| DELETE    | Delete a post by Id and unreference the creator     |
| /api/courses/:courseId/posts/                           | DELETE    | Delete all posts in a specific course               |


Comments
------
| Route                                  | HTTP Verb | Description                                                 |
|----------------------------------------|-----------|-------------------------------------------------------------|
| /api/posts/:postId/comments            | POST      | Create a comment by postId __(data: content)__              |
| /api/posts/:postId/comments/:commentId | PUT       | Update a comment by postId + commentId __(data: content)__  |
| /api/posts/:postId/comments/:commentId | DELETE    | Delete a comment by postId + commentId                      |

User
------
| Route                                  | HTTP Verb | Description                                                 |
|----------------------------------------|-----------|-------------------------------------------------------------|
| /api/users                          | GET       | Get all user                                             |
| /api/users/:userId               | GET       | Get user by userId                                    |
| /api/users/:userId/posts         | GET       | Get user's post by UserId                             |
| /api/users/:userId/comments      | GET       | Get user's comments by UserId                         |
