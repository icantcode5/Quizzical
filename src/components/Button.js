import React from "react"

export default function Button(props) {
	return (
		<button onClick={() => props.handleCheckAnswers(props.correctAnswer)}>
			Check Answers
		</button>
	)
}
