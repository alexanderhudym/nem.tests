/**
 * Created by Alexander on 28.10.17.
 */

let config = {
    account: null,
    meta: null
};

let tests = [
    {
        id : 1,
        title: '3+3=?',
        rightAnswer: 6,
        answers: [3, 5, 7, 6]
    },
    {
        id : 2,
        title: '3+7=?',
        rightAnswer: 10,
        answers: [3, 10, 7, 6]
    },
    {
        id : 3,
        title: '3+1=?',
        rightAnswer: 4,
        answers: [4, 5, 7, 6]
    },
    {
        id : 4,
        title: 'Very hard question. 2+2*2=?',
        rightAnswer: 6,
        answers: [3, 5, 7, 6]
    },

];


$('#wallet-input').find('button').on('click', function (event) {
    let walletAddressInput = $('#wallet-input').find('input');
    let walletAddress = walletAddressInput.val();
    if (walletAddress.length === 0) {
        alert('Wallet address is not fill')
    } else {
        walletAddress = walletAddress.replace(new RegExp('-', 'g'), '');
        $.get('http://localhost:3100/users/' + walletAddress)
            .done(function (res) {
                console.log(res);
                config.account = res.account;
                config.meta = res.meta;
                let walletAddressContainer = document.getElementById('wallet-address-container');
                walletAddressContainer.style.display = 'block';
                walletAddressContainer.getElementsByTagName('p').item(0).textContent = "Your wallet address is " + res.account.address;
                $('#wallet-input').hide();
                let testContainer = document.getElementById('test-container');
                testContainer.style.display = 'block';
                tests.forEach(test => {
                    let testForm = document.createElement('form');
                    testForm.id = test.id;
                    testContainer.appendChild(testForm);
                    let fieldSet = document.createElement('fieldset');
                    testForm.appendChild(fieldSet);
                    let legend = document.createElement('legend');
                    legend.textContent = test.title;
                    fieldSet.appendChild(legend);
                    let div = document.createElement('div');
                    fieldSet.appendChild(div);
                    test.answers.forEach(answer => {
                        let answerRadio = document.createElement('input');
                        answerRadio.type = 'radio';
                        answerRadio.id = 'radio' + answer;
                        answerRadio.name = test.title;
                        answerRadio.value = answer;
                        div.appendChild(answerRadio);
                        let answerLabel = document.createElement('label');
                        answerLabel.textContent = answer;
                        div.appendChild(answerLabel);
                    });
                });

                let submitTestButton = document.createElement('button');
                submitTestButton.textContent = "Submit";
                testContainer.appendChild(submitTestButton);
                submitTestButton.onclick = function (event) {
                    let rightAnswerCount = 0;
                    tests.forEach(test => {
                        let selectedOption = $("input:radio[name='" + test.title + "']:checked").val();
                        if (selectedOption == test.rightAnswer) {
                            rightAnswerCount += 1;
                        }
                    });

                    if (rightAnswerCount != tests.length) {
                        alert("incorrect aswer");
                    } else {
                        $.post('http://localhost:3100/users/send_certificate', { wallet: config.account.address})
                            .done(function (res) {
                                console.log(res);
                                alert("Now you have proof of your intelligence.")
                            })
                            .fail(function (err) {
                                console.log(err);
                                alert("Send certificate failed. Try again later")
                            })
                    }

                }
            })
            .fail(function (err) {
                alert('Invalid wallet address')
            })
    }
});



// TB6ZW2-NNO7SE-ZXNPEB-NHETIT-AHZIPM-EH22U5-TVME