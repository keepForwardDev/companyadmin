export const checNotNull = (msg) => {
  if (msg) {
    return [{ required: true, message: msg, trigger: 'blur' }]
  } else {
    return [{ required: true, message: '该项为必填项，请填写完整！', trigger: 'blur' }]
  }
}
