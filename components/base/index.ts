/**
 * 基础组件统一导出
 */
import Button from './Button.vue'
import Input from './Input.vue'
import Modal from './Modal.vue'
import Loading from './Loading.vue'
import Empty from './Empty.vue'

export const XButton = Button
export const XInput = Input
export const XModal = Modal
export const XLoading = Loading
export const XEmpty = Empty

export default {
  Button,
  Input,
  Modal,
  Loading,
  Empty
}
