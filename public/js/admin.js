const deleteProduct = btn => {
    const productId = btn.parentNode.querySelector('[name=productId]').value;
    console.log(productId);

    const productElement = btn.closest('.product');

    fetch('/admin/delete-product/' + productId, {
        method: 'DELETE'
    })
    .then(result => {
        productElement.remove();
        console.log('removed!');
    })
    .catch(err => console.log(err));
};
