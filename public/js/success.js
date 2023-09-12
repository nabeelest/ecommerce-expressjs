setTimeout(function() {
    fetch('/shop/create-order', {
        method: 'POST'
    })
    .then(response => {
        if (response.status === 200) {
            window.location.href = '/shop';
        } else {
            console.error('Error:', response.statusText);
        }
    })
    .catch(function(error) {
        console.error('Error:', error);
    });
}, 5000); 
    
