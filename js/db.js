
import { openDB } from "idb";

let db;

if('serviceWorker' in navigator){
    window.addEventListener('load', async() =>{
        try{
            let reg;
            reg = await navigator.serviceWorker.register('/sw.js', {type:'module'});
            console.log('sw registrada')
        }catch(err){
            console.log('erro na sw', err);
        }
    })
}

async function iniciarBancoDeDados() {
    try {
        db = await openDB('banco', 1, {
            upgrade(db, oldVersion, newVersion, transaction) {
                switch (oldVersion) {
                    case 0:
                    case 1:
                        const store = db.createObjectStore('resultados', {
                            keyPath: 'titulo'
                        });
                        store.createIndex('id', 'id');
                        console.log("Banco de dados criado!");
                }
            }
        });
        console.log("Banco de dados aberto!");
        return db;
    } catch (e) {
        console.log('Erro ao criar/abrir banco: ' + e.message);
        throw e;
    }
}



async function search() {
    const titulo = document.getElementById('store-name').value;
    const category = document.getElementById('category').value;
    const priceRange = document.getElementById('price-range').value;
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;



    /*const searchResults = document.getElementById('search-results');
    const resultItem = document.createElement('div');
    resultItem.innerHTML = `<strong>Loja:</strong> ${titulo}, <strong>Categoria:</strong> ${category}, <strong>Faixa de Preço:</strong> ${priceRange}, <strong>Latitude:</strong> ${latitude}, <strong>Longitude:</strong> ${longitude}`;
    searchResults.appendChild(resultItem);*/

    // Salvar no banco de dados
    saveSearch({ titulo, category, priceRange, latitude, longitude });
}

async function clearSearches() {
    // Limpar dados na interface
    document.getElementById('search-results').innerHTML = '';
    // Limpar dados no banco
    await clearSearchesFromDB();
}

async function saveSearch(search) {
    try {
        // Salvar no banco de dados
        console.log(search);
        const tx = db.transaction('resultados', 'readwrite');
        const store = tx.objectStore('resultados');
        await store.add(search);
        await tx.done;
        console.log('Busca salva no banco de dados:', search);
    } catch (error) {
        console.error('Erro ao salvar busca no banco de dados:', error);
    }
}

async function clearSearchesFromDB() {
    try {
        // Limpar dados no banco de dados
        await iniciarBancoDeDados();
        const tx = db.transaction('resultados', 'readwrite');
        const store = tx.objectStore('resultados');
        await store.clear();
        await tx.done;
        console.log('Dados do banco de dados limpos!');
    } catch (error) {
        console.error('Erro ao limpar dados do banco de dados:', error);
    }
}

// Carregar buscas salvas ao carregar a página
window.onload = async function () {
    iniciarBancoDeDados();
    await getAllSearchesFromDB();
    
    const btnCad = document.getElementById('cads');
    btnCad.addEventListener('click', search);
    const btnlist = document.getElementById('lista');
    btnlist.addEventListener('click', getAllSearchesFromDB);


}

async function getAllSearchesFromDB() {
    try { 
        const searchResults = document.getElementById('search-results');
        searchResults.innerHTML = "";

        const tx = db.transaction('resultados', 'readonly');
        const store = tx.objectStore('resultados');

        const lojas = await store.getAll();
        if(lojas!=null){
        lojas.forEach(search => {
            const resultItem = document.createElement('div');
            resultItem.setAttribute("id", "lojas");
            resultItem.innerHTML = `<strong>Loja:</strong> ${search.titulo}, 
            <strong>Categoria:</strong> ${search.category}, <strong>Faixa de Preço:</strong> 
            ${search.priceRange},<strong>Latitude:</strong> ${search.latitude}, 
            <strong>Longitude:</strong> ${search.longitude}
            <iframe id="iframe"
            src="http://maps.google.com/maps?q=${search.latitude},${search.longitude}&z=16&output=embed"
            frameborder="0" scrolling="no" style="width: 100%; height: 400px;"></iframe>
            `; 
            searchResults.appendChild(resultItem);
        });
    }
    } catch (error) {
        console.error('Erro ao obter buscas do banco de dados:', error);
        return [];
    }
}
