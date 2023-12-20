const form = document.querySelector(".grocery-form")
const alert = document.querySelector(".alert")
const grocery = document.getElementById("grocery")
const submitBtn = document.querySelector(".submit-btn")
const container = document.querySelector(".grocery-container")
const list = document.querySelector(".grocery-list")
const clearBtn = document.querySelector(".clear-btn")

let editElement      //düzenleme yapılan ögeyi temsil eder
let editFlag = false //düzenleme modunda olup olmadığını belirtir
let editID = ""      //benzersiz id 
/* editID, her bir itemin benzersiz id'si olacak. tıklandığı zaman id'sine göre 
value'sini çağıracağız, şeklinde işlemler yapacağız. ilk etapta boş tanımladık */ 
/*
editFlag, başlangıçta false olsun, ekle'ye tıklandığında true olursa tanımladığımız
değer, inputun içine gelecek value'yi ve ekle butonunun içindeki değişimi
görmek için yaptık.
*/

// form gönderildiğinde addItem fonk. çağır
form.addEventListener("submit", addItem)

// temizle butonuna tıklanıldığında clearItems fonk. çağır
clearBtn.addEventListener("click", clearItems)

// sayfa yüklendiğinde setupItems fonk. çağır
window.addEventListener("DOMContentLoaded", setupItems)

// functions
function addItem(e){
    e.preventDefault()   //ekle'ye bastığmızda artık sayfamız yenilenmiyor.
    const value = grocery.value   //inputun içine yazılanı aldık
    const id = new Date().getTime().toString() //gettime ile şu anki zamanı aldık. tostring ile o sayıları yazıya dönüştürdük

    /*hemen aşağıdaki kod, eğer value boş değilse ve editFlag false ise (yani 
    düzenleme modu kapalıysa),o zaman aşağıdaki kodları çalıştır demektir. Yani, 
    eğer kullanıcı bir değer girmişse ve düzenleme modu açık değilse, bir öğe 
    eklemeye hazırız demektir.*/
    if (value !== "" && !editFlag){  //editflag false ise demek
        const element = document.createElement("article")
        let attr = document.createAttribute("data-id")
        attr.value = id
        /* createAttiribute, yeni bir özellik ekleme metodunu kullanarak, data-id
        özelliği ekleyelim dedik. html'ye id eklerken genelde data-id diye söyleriz.
        bu özelliğin değerine de yukarıda tarih kullanarak oluşturduğumuz id'yi verdik.
        /// her eklenecek article elemanın benzersiz bir kimliği olması için uğraşıyoruz.
        */
        element.setAttributeNode(attr)
        /*bu oluşturduğumuz attr'yi de elementin içine setAttributeNode ile ekledik*/
        element.classList.add("grocery-item")
        // console.log(element)
        element.innerHTML = `
        <p class="title">${value}</p>
        <div class="btn-container">
          <button class="edit-btn" type="button">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="delete-btn" type="button">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>`

        /*bunu en yukarda tanımlasak olmazdıç çünkü bir üstte daha yeni oluşturduk. anca şimdi çalışır*/
        const deleteBtn = element.querySelector(".delete-btn") //elementin içindeki delete-btn'yi alacağız. document deseydik eğer html kısmındakini alacaktı.
        deleteBtn.addEventListener("click", deleteItem)

        const editBtn = element.querySelector(".edit-btn")
        editBtn.addEventListener("click", editItem)

        list.appendChild(element) //appenchild ile listin içine gönderdik elemenet'i.
        //en dıştaki kapsayıcıya bu article elementini gönderdik.

        displayAlert("Başarıyla Eklendi", "success")

        // show containeri ekledik
        container.classList.add("show-container")

        // localStorage'a ekleme
        addTolocalStorage(id, value)

        // içeriği temizleme
        setBackToDefault()

    } else if (value !== "" && editFlag){
        editElement.innerHTML = value
        displayAlert("Düzenlendi", "success")
        editLocalStorage(editID, value)
        setBackToDefault()  //bununla eski halin eçevirmiş olduk
    } else{
        displayAlert("Lütfen bir ürün ekleyin", "danger")
    }

}

// alert fonksiyonu
function displayAlert(text, action){
    alert.textContent = text
    alert.classList.add(`alert-${action}`)
    setTimeout(function (){
        alert.textContent = ""
        alert.classList.remove(`alert-${action}`)
    },1300)
}

// temizleme işlemi
function setBackToDefault(){
    grocery.value = ""
    editFlag = false
    editID = ""
    submitBtn.textContent = "Ekle"  //yani bu fonksiyon çağırıldığında submitBtn'nin textContenti, Ekle olarak değişsin
    // edit kısmında bu sonuncusu değişecek.
}
/* yazdıktan sonra inputun içi temizlensin. ilk 3'ü bu yüzden yapıldı.
sonuncusu ise edit modunda tekrar bu fonksiyonu kullanacağız ona sebep yapıldı.*/

// silme işlemi
function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement
    // currentTArget ile bizi hemen bir üst elemana atıyor. o yüzden ilk onu kullandık.
    
    list.removeChild(element) //sildik

    if(list.children.length == 0){
        container.classList.remove("show-container")
    } //listeyi temizle yazısını kaldırmış olduk

    displayAlert("Silindi", "danger")
    
    
    const id = element.dataset.id
    /*içinde oluşturduğumuz id'ye ulaşmak için dateset'i kullanacağız. 
    dataset'in içindeki id dedik. onu da id isimli bir değişkene atadık*/
    //bunu localde eklenen elemeti id'sine göre silmek için yaptık

    removeFromLocalStorage(id)
}

// düzenleme
function editItem(e){
    const element = e.currentTarget.parentElement.parentElement
    editElement = e.currentTarget.parentElement.previousElementSibling //aynı hizadaki p elementine ulaşmış olduk
    
    // form değerini, düzenlenen ögenin metniyle doldurduk
    grocery.value = editElement.innerHTML

    editFlag = true
    editID = element.dataset.id //düzenlenen elemnetin kimliği
    submitBtn.textContent = "Düzenle"
    
    // console.log(editElement)
}

// listeyi temizleme
function clearItems(){
    const items = document.querySelectorAll(".grocery-item")
    if (items.length > 0){
        items.forEach(function(item){
            list.removeChild(item) //her ögeyi listeden kaldırır
        })
    }
    container.classList.remove("show-container")
    displayAlert("Liste Temizlendi", "danger")
}

/* localStorage işlemleri */
// yerel depoya öge ekleme işlemi
function addTolocalStorage(id, value){
    const grocery = {id, value}
    let items = getLocalStorage()
    items.push(grocery)
    localStorage.setItem("list", JSON.stringify(items))
}

// localStorage'dan verileri alma işlemi
function getLocalStorage(){
    return localStorage.getItem("list") 
    ? JSON.parse(localStorage.getItem("list")) 
    : []
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage();

    // items dizisinden id'ye sahip öğeyi filtrele
    items = items.filter(function (item) {
        return item.id !== id;
    });

    // güncellenmiş items dizisini localStorage'a geri yaz
    localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
    let items = getLocalStorage();

    // items dizisindeki ilgili öğeyi bul ve güncelle
    items = items.map(function (item) {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    });

    // güncellenmiş items dizisini localStorage'a geri yaz
    localStorage.setItem("list", JSON.stringify(items));
}

function setupItems() {
    let items = getLocalStorage();

    if (items.length > 0) {
        items.forEach(function (item) {
            const element = document.createElement("article");
            let attr = document.createAttribute("data-id");
            attr.value = item.id;
            element.setAttributeNode(attr);
            element.classList.add("grocery-item");
            element.innerHTML = `
                <p class="title">${item.value}</p>
                <div class="btn-container">
                    <button class="edit-btn" type="button">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="delete-btn" type="button">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>`;

            const deleteBtn = element.querySelector(".delete-btn");
            deleteBtn.addEventListener("click", deleteItem);

            const editBtn = element.querySelector(".edit-btn");
            editBtn.addEventListener("click", editItem);

            list.appendChild(element);
            container.classList.add("show-container");
        });
    }
}