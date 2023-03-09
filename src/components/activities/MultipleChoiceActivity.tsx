import React from "react";
import { useRef, useState } from "react";
import { CurrentUser } from "../..";
import styles from "../../styles/activities/MultipleChoice.module.css"

function shuffle(array): string[] {
  let currentIndex = array.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}



export default class MultipleChoiceActivity extends React.Component<{currentUser: CurrentUser, data: string, advance: () => void}, {status: "ANSWERING"|"CORRECT"|"WRONG"}> {
  question: string;
  correct: string;
  options: string[];
  explanation: string;

  constructor(props) {
    super(props) 
    
    const options_: string[] = this.props.data.split(/\[|\]/g)
    this.question = options_.shift()
    this.correct = options_[0]

    if(options_[options_.length-1].includes("@")) {
      [options_[options_.length-1], this.explanation] = options_[options_.length-1].split("@")
    }
    this.options = shuffle(options_)
    this.state = {status: "ANSWERING"}
  }



  getStyle(i) {
    switch(i%4) {
      case 0: return styles.t1
      case 1: return styles.t2
      case 2: return styles.t3
      case 3: return styles.t4
    }
  }

  buttonClick(optionNum) {
    if(this.options[optionNum] === this.correct) {
      this.setState({status: "CORRECT"})
      setTimeout(() => {
        this.props.advance()
      }, 700)

    } else {

      this.setState({status: "WRONG"})
      if(!this.explanation) setTimeout(() => {
        this.props.advance()
      }, 1200)
    }
  }


  render() {
      return <div>
          <div className={styles.title}>{this.question}</div>

          <div className={styles.lower}>

              {this.options.map((o, i) => {
                return <button
                className={this.getStyle(i)+((this.options[i] === this.correct && this.state.status === "WRONG") ? " "+styles.correctAnswerRevealed:"")}
                onClick={() => this.buttonClick(i)}
                key={i}
                disabled={this.state.status !== "ANSWERING"}
                >{o}</button>
              })}
          </div>
          

          {this.state.status === "WRONG" ? <div className={styles.incorrect}>
            <span>Oops, not quite right.</span>
            {this.explanation ? <div><br /><br />{this.explanation}
              <div className={styles.continueButtonContainer}><button onClick={this.props.advance}>Continue</button></div></div>
              : <div />}
            
          </div> : this.state.status === "CORRECT" ? <div className={styles.correct}>
              Correct!
              </div> : <div />}
      </div>
    }
}