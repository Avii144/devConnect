# Devtinder

authRouter

- POST/signup
- POST/Login
- POST/logout

profileRouter

- GET/profile/view
- PATCH/profile?edit
- PATCH/profile/password

connectionRequestRouter

- POST /request/send/interested/:userId
- POST /request/send/ignore/:userId
- POST /request/review/accepted/:resquestId
- POST /request/review/ignored/:resquestId

userRouter

- GET/user/connections
- GET/user/request/received
- GET/user/feed
  Status:ignore,interested,accepted,ignored
