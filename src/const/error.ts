enum BaseResponseCode {
  SUCCESS = 0,
  /** 未知错误 */
  UNKNOWN = 10000,
  /** 未登录 */
  UNAUTHORIZED = 401,
  /** 无权限 */
  FORBIDDEN = 403,
  /** 无此路由 */
  NOT_FOUND = 404,
  /** 服务器错误 */
  SERVER_ERROR = 500,
  /** 网络错误 */
  NETWORK_ERROR = 10001,
  /** 请求超时 */
  TIMEOUT = 10002,
  /** 无效的请求 */
  INVALID_REQUEST = 10003,
  /** 无效的参数 */
  INVALID_PARAMS = 10004,
}

enum AuthError {
  /** 用户名不存在 */
  USER_NOT_FOUND = 10100,
  /** 账号或密码不正确 */
  WRONG_PASSWORD = 10101,
  /** 用户已存在 */
  USER_ALREADY_EXIST = 10102,
  /** 两次密码输入不一致 */
  PASSWORD_NOT_MATCH = 10103,
}

// 在这里定义用户模块的错误 102
enum UserError {
  /** 用户名不存在 */
  USER_NOT_FOUND = 10200,
}

// 在这里定义 HomeLab 模块的错误 103
enum HomeLabError {}

// 在这里定义 iFlow 模块的错误 104
enum IFlowError {}

type ErrorCode = BaseResponseCode | AuthError | UserError | HomeLabError;

export { ErrorCode, BaseResponseCode, AuthError, UserError, HomeLabError, IFlowError };
