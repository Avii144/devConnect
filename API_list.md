# Devtinder

## authRouter

- POST/signup
- POST/Login
- POST/logout

## profileRouter

- GET/profile/view
- PATCH/profile?edit
- PATCH/profile/password

## connectionRequestRouter

- POST /request/send/:status/:userId
- POST /request/review/:status/:resquestId

Status:ignore,interested,accepted,ignored

## userRouter

- GET/user/connections
- GET/user/request/received
- GET/user/feed
