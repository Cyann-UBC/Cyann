API Reference
======
Handler
------
| Params                                            |HTTP Verb  | Description                                           |
|---------------------------------------------------|-----------|-------------------------------------------------------|
| courseId                                          | N/A       | find course by id and store the result in req.course  |
| postId                                            | N/A       | find post by id and store the result in req.post      |
| commentId                                         | N/A       | find comment by id and store the result in req.comment|
| userId                                            | N/A       | find user by id and store the result in req.user      |

Courses
------
| Route                                             | HTTP Verb | Description                                               |
|---------------------------------------------------|-----------|-----------------------------------------------------------|
| /api/courses                                      | GET       | Get all courses                                           |
| /api/courses/user                                 | GET       | Get all users in a course                                 |
| /api/courses/:courseName                          | GET       | Get a course by courseName                                |
| /api/courses/:courseId                            | GET       | Get a course by courseId                                  |
| /api/courses                                      | POST      | Create a course                                           |

Posts
------
| Route                                                   | HTTP Verb | Description                                         |
|---------------------------------------------------------|-----------|-----------------------------------------------------|
| /api/courses/:courseId/posts                            | GET       | Get all posts in a specific course given courseId   |
| /api/courses/:courseId/posts/:postId                    | GET       | Get a specific post in a specific course            |
| /api/courses/:courseId/users/:userId/posts              | POST      | Create a post in a course and reference a user      |
| /api/courses/:courseId/posts/:postId                    | PUT       | Update a post by courseId and postId                |
| /api/courses/:courseId/users/:userId/posts/:postId      | DELETE    | Delete a post by Id and unreference the creator     |
| /api/courses/:courseId/posts/                           | DELETE    | Delete all posts in a specific course               |


Comments
------
| Route                                                                        | HTTP Verb | Body Param       | Description                    |
|------------------------------------------------------------------------------|-----------|------------------|--------------------------------|
| /api/courses/{:courseId}/posts/{:postId}/comments                            | GET       | userId           |  Retrieves all comments        |
| /api/courses/{:courseId}/posts/{:postId}/comments/{:commentId}               | GET       | userId           |  Retrieve comment by its ID    |
| /api/courses/{:courseId}/posts/{:postId}/comments                            | POST      | userId, content  |  Create comment                |
| /api/courses/{:courseId}/posts/{:postId}/comments/{:commentId}               | PUT       | userId, content  |  Edit comment                  |
| /api/courses/{:courseId}/posts/{:postId}/comments/{:commentId}               | DELETE    | userId           |  Delete comment                |
| /api/courses/{:courseId}/posts/{:postId}/comments/{:commentId}/setAsAnswer   | PUT       | userId           |  Set comment as Answer         |
| /api/courses/{:courseId}/posts/{:postId}/comments/{:commentId}/unsetAsAnswer | PUT       | userId           |  Unset comment as Answer       |
| /api/courses/{:courseId}/posts/{:postId}/comments/{:commentId}/upvote        | PUT       | userId           |  Upvote comment                |
| /api/courses/{:courseId}/posts/{:postId}/comments/{:commentId}/downvote      | PUT       | userId           |  Downvote comment              |
| /api/courses/{:courseId}/posts/{:postId}/comments/{:commentId}/resetVote     | PUT       | userId           |  Reset vote for comment        |



User
------
| Route                                  | HTTP Verb | Description                                                 |
|----------------------------------------|-----------|-------------------------------------------------------------|
| /api/users                             | GET       | Get all user                                                |
| /api/users/:userId                     | GET       | Get user by userId                                          |
| /api/users/:userId/posts               | GET       | Get user's post by UserId                                   |
| /api/users/:userId/comments            | GET       | Get user's comments by UserId                               |
