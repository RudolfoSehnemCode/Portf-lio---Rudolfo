let ultimo_envio = 0;

        function enviarWhats(event) {
            event.preventDefault()

            const nome = document.getElementById('nome').value;
            const mensagem = document.getElementById('mensagem').value;
            const telefone = '5547997477499'


            if (nome.trim() === '' || mensagem.trim() === '') {
                alert('Preencha todos os campos!');
                return;
            }


            const agora = Date.now();
            if (agora - ultimo_envio < 30000) {
                document.getElementById('aviso').textContent = 'Aguarde 30 segundos antes de enviar novamente';
                return;
            }

            ultimo_envio = agora;

            const texto = `Olá me chamo ${nome}, ${mensagem}`
            const msgFormatada = encodeURIComponent(texto)

            const url = `https://wa.me/${telefone}?text=${msgFormatada}`

            document.getElementById('formulario').reset();
            document.getElementById('aviso').textContent = '';

            window.open(url, '_blank')
        }