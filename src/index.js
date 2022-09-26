import { initializeApp } from 'firebase/app'
import {
    getFirestore,
    collection,     //reference to collection
    getDocs,
    addDoc,
    deleteDoc,
    doc,     //reference to document
    onSnapshot,
    query,
    where,
    serverTimestamp,
    orderBy,
    getDoc,
    updateDoc
} from 'firebase/firestore'

import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCmqA7IKiGlBvMtut9XKiJL-d6OZ-4EpKA",
    authDomain: "fir-demo-ef4dd.firebaseapp.com",
    projectId: "fir-demo-ef4dd",
    storageBucket: "fir-demo-ef4dd.appspot.com",
    messagingSenderId: "149674336562",
    appId: "1:149674336562:web:a4420238cb4a33bef9772b"
};

initializeApp(firebaseConfig)

const db = getFirestore()

const booksCollRef = collection(db, 'books')

// getDocs(booksCollRef).then(snapshot => {
//     return snapshot.docs.forEach(doc => {
//         console.log({ ...doc.data(), id: doc.id });
//     })
// })

// const q = query(booksCollRef, where("author", "==", "xyzz"))
// const q = query(booksCollRef, orderBy('title', 'asc'))
const q = query(booksCollRef, orderBy('createdAt'))

// const unsubColl = onSnapshot(booksCollRef, (snapshot) => {    //sets a subscription to a collection(i.e watches for changes on collection)
//     console.clear()
//     return snapshot.docs.forEach(doc => {
//         console.log({ ...doc.data(), id: doc.id });
//     })
// })

const unsubColl = onSnapshot(q, (snapshot) => {
    console.clear()
    return snapshot.docs.forEach(doc => {
        console.log({ ...doc.data(), id: doc.id });
    })
})

const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
    e.preventDefault()
    addDoc(booksCollRef, {
        title: addBookForm.title.value,
        author: addBookForm.author.value,
        createdAt: serverTimestamp()
    }).then(() => {
        addBookForm.reset()
    })
})

const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const docRef = doc(db, 'books', deleteBookForm.id.value)
    deleteDoc(docRef).then(() => {
        deleteBookForm.reset()
    })
})

const docRef = doc(db, 'books', "06pGXb9PKozeNwhaBQwP")
// getDoc(docRef).then((doc) => console.log(doc.data(), doc.id))

const unsubDoc = onSnapshot(docRef, (doc) => {       //sets a subscription to a document(i.e watches for changes on document)
    console.log({ ...doc.data(), id: doc.id });
})

const updateBookForm = document.querySelector('.update')
updateBookForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const docRef = doc(db, 'books', updateBookForm.id.value)
    updateDoc(docRef, {
        title: 'updated title',
        author: 'updated author'
    }).then(() => {
        updateBookForm.reset()
    })
})

//Authentication--------------------------------------------------------------------------
//Firebase uses jwt tokens for authentication
const auth = getAuth()

const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = signupForm.email.value
    const password = signupForm.password.value
    createUserWithEmailAndPassword(auth, email, password)
        .then((credentials) => {
            console.log("User created", credentials.user)
            signupForm.reset()
        }).catch(err => console.log(err))
})

const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
    console.log(auth);     //auth object stores currently logged in user info
    signOut(auth)
        .then(() => {
            console.log("User logged out")
        })
        .catch((err) => console.log(err))
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    signInWithEmailAndPassword(auth, loginForm.email.value, loginForm.password.value)
        .then((credentials) => {
            console.log("User signed in", credentials.user)
            console.log(auth)
            loginForm.reset()
        })
        .catch((err) => console.log(err.message))
})

const unsubAuth = onAuthStateChanged(auth, (user) => {    //subscription to auth status, i.e signin, signup, signout
    console.log("Auth state changed", user)
})

const unsubscribeButton = document.querySelector('.unsub')
unsubscribeButton.addEventListener('click', () => {
    console.log('unsubscribing from all subscriptions')
    unsubColl()
    unsubDoc()
    unsubAuth()
})