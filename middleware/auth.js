export default function ({store, redirect}) {
  if (!store.state.common.token) {
    return redirect('/')
  }
}
