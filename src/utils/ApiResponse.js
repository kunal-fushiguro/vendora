class ApiReponse {
  constructor(statusCode, Message, data = {}, success) {
    this.statusCode = statusCode;
    this.Message = Message;
    this.success = success;
    this.data = data;
  }
}

export { ApiReponse };
