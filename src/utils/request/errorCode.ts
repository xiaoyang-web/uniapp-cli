// 401: 可能存在一个页面请求多个接口出现401的情况,此时应该有个标识,要不然会重复调用该函数
let responseIsActive = false;
const onResponse401 = () => {
  if (responseIsActive) return;
  responseIsActive = true;
  uni.showModal({
    title: '温馨提示',
    content: '登录状态失效，请重新登录！',
    showCancel: false,
    success: function (result) {
      if (result.confirm) {
        responseIsActive = false;
        // TODO: 清空缓存
        // TODO: 重定向到登录页
        console.log('重定向');
      }
    }
  });
};
// 403: 权限不足
const onResponse403 = () => {
  uni.showToast({
    title: '请求接口失败，访问权限不足！',
    duration: 3000,
    icon: 'none',
    mask: true
  });
};
// 404: 接口不存在
const onResponse404 = () => {
  uni.showToast({
    title: '请求接口失败，无效的接口地址！',
    duration: 3000,
    icon: 'none',
    mask: true
  });
};
// 500: 服务器内部错误
const onResponse500 = () => {
  uni.showToast({
    title: '请求接口失败，请稍后再试！',
    duration: 3000,
    icon: 'none',
    mask: true
  });
};
// 504: 网关错误
const onResponse504 = () => {
  uni.showToast({
    title: '请求接口失败，错误的网关！',
    duration: 3000,
    icon: 'none',
    mask: true
  });
};

export { onResponse401, onResponse403, onResponse404, onResponse500, onResponse504 };
