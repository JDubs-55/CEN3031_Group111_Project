import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'test-auth';
  public data: any = []

  constructor(private auth: Auth, private http: HttpClient) {

  }

  addUser(value: any) {
    createUserWithEmailAndPassword(this.auth, value.email, value.password)
      .then((response: any) => {
        console.log(response.user.idToken)
      })
      .catch((err) => {
        alert(err.message)
      })

    //Sign out after user creation?
    /*
    this.auth.signOut()
    .then(() => {
      console.log("Signed out.")
    })
    */
  }

  signIn(value: any) {

    interface User {
      email: string
      username: string
      id: string
    }

    interface Card {
      ID: string
      FrontText: string
      BackText: string
      IsFavorite: boolean
    }

    interface Deck {
      ID: string
      Name: string
      Tags: string[]
      IsFavorite: boolean
      Cards: Card[]
      Owner: string
    }


    console.log("Sign in was pressed.")

    signInWithEmailAndPassword(this.auth, value.email, value.password)
      .then((response: any) => {
        console.log(response.user)
        this.auth.currentUser?.getIdToken(true)
          .then(idToken => {
            console.log(idToken)
            this.http.get<User>("http://localhost:4201/api/getuser/" + idToken,
              { responseType: 'json' }).subscribe(data => {
                console.log(data)
              })
          })
          .catch((err) => {
            alert(err.message)
          })
      })
      .catch((err) => {
        alert(err.message)
        return
      })
  }

  signOut() {
    this.auth.signOut()
      .then(() => {
        console.log("Signed out.")
      })
      .catch((err) => {
        alert(err.message)
      })
  }
}
