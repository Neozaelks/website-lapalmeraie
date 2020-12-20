const nicknameInput = document.getElementById('nickname')
const amountInput = document.getElementById('amount')

$("#amount").inputSpinner({
  template:
    '<div class="input-group ${groupClass}">' +
    '<input type="text" inputmode="decimal" style="text-align: ${textAlign}" class="form-control form-control-text-input"/>' +
    '<div class="input-group-prepend"><span class="input-group-text">€</span><button style="min-width: ${buttonsWidth}" class="btn btn-decrement ${buttonsClass} btn-minus" type="button">${decrementButton}</button></div>' +
    '<div class="input-group-append"><button style="min-width: ${buttonsWidth}" class="btn btn-increment ${buttonsClass} btn-plus" type="button">${incrementButton}</button></div>' +
    '</div>'
})

paypal.Buttons({
  locale: 'fr_FR',
  style: {
    color: 'blue',
    shape: 'pill',
    label: 'pay'
  },
  createOrder: (data, actions) => {
    return fetch('/create-donation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nickname: nicknameInput.value,
        amount: amountInput.value
      })
    }).then(res => {
      return res.json()
    }).then(res => {
      return res.id
    })
  },
  onApprove: (data, actions) => {
    return fetch(`/capture-donation/${data.orderID}`, {
      method: 'POST'
    }).then(res => {
      if (!res.ok) alert('Something went wrong')
    })
  }
}).render('#paypal-button-container')
