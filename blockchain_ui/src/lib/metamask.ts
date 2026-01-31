export const connectMetaMask = async () => {
  if (!window.ethereum) {
    alert('Bạn chưa cài MetaMask')
    window.open('https://metamask.io/', '_blank')
    return null
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })

    return accounts[0] as string
  } catch (error: any) {
    console.error(error)
    alert('Kết nối MetaMask thất bại')
    return null
  }
}
