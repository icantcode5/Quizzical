import React from "react"
// import htmlenteties from "html-enteties"

export default function TriviaPage(props) {
	// console.log(props.id)

	let answers = props.choices.map((obj, i) => {
		let id = ""

		if (props.checkAnswers) {
			if (props.correctAnswer === obj.option && obj.isHeld) {
				id = "correct-selected"
			}

			if (props.correctAnswer === obj.option && !obj.isHeld) {
				id = "correct-not-selected"
			}

			if (props.correctAnswer !== obj.option && obj.isHeld) {
				id = "wrong-selected"
			}

			if (props.correctAnswer !== obj.option && !obj.isHeld) {
				id = "not-selected"
			}
		}

		return (
			<button
				key={i}
				//prettier-ignore
				onClick={() => props.handleClicked(obj.option, props.id)}
				id={id}
				className={obj.isHeld ? "selected" : ""}
				disabled={props.checkAnswers && true}
			>
				{obj.option}
			</button>
		)
	})

	return (
		<main className="main">
			<div className="divContainer">
				<h1>{props.question}</h1>
				<div className="divContainer2">{answers}</div>
			</div>
		</main>
	)
}
