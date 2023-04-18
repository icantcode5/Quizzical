import React, { useEffect } from "react"
import TitlePage from "./components/TitlePage"
import TriviaPage from "./components/TriviaPage"
import Button from "./components/Button"
import decode from "html-entities-decoder"
import { nanoid } from "nanoid"

function App() {
	const [isQuizStarted, setIsQuizStarted] = React.useState(false)
	const [checkAnswers, setCheckAnswers] = React.useState(false)
	const [playAgain, setPlayAgain] = React.useState(false)
	const [isCorrect, setIsCorrect] = React.useState(0)

	const [triviaArray, setTriviaArray] = React.useState({
		question: "",
		correctAnswer: "",
		id: 0,
		choices: [],
	})

	//helper function to combine correct answer and incorrect answers into one array and then shuffle the array in place.
	function combineAndShuffleArray(obj) {
		return obj.incorrect_answers
			.concat(obj.correct_answer)
			.map((value, i) => {
				return {
					option: decode(value),
					isHeld: false,
					correctAns: obj.correct_answer,
				}
			})
			.map((value) => ({ ...value, sort: Math.random() }))
			.sort((a, b) => a.sort - b.sort)
			.map(({ sort, ...rest }) => rest)
	}

	React.useEffect(() => {
		fetch("https://opentdb.com/api.php?amount=5&category=19")
			.then((response) => response.json())
			.then((data) => {
				setTriviaArray((prevObj) => {
					return data.results.map((obj) => {
						console.log(obj.correct_answer)
						return {
							...prevObj,
							question: decode(obj.question),
							correctAnswer: decode(obj.correct_answer),
							id: nanoid(),
							choices: combineAndShuffleArray(obj),
						}
					})
				})
			})
			.catch((err) => console.log("error with state setting"))
	}, [playAgain])

	//mobile feature
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [checkAnswers])

	function handleStartQuiz() {
		setIsQuizStarted(true)
	}

	function handleClicked(btnOption, objId) {
		setTriviaArray((prevArray) => {
			return prevArray.map((obj) => {
				if (obj.id === objId) {
					return {
						...obj,
						choices: obj.choices.map((obj2) => {
							if (obj2.option === btnOption) {
								return {
									...obj2,
									isHeld: !obj2.isHeld,
								}
							} else {
								return {
									...obj2,
									isHeld: false,
								}
							}
						}),
					}
				} else {
					return obj
				}
			})
		})
	}

	function handleCheckAnswers() {
		let count = 0
		triviaArray.forEach((obj) => {
			obj.choices.forEach((obj2) => {
				if (obj2.option === obj2.correctAns && obj2.isHeld) {
					count += 1
				}
			})
		})

		setIsCorrect(count)
		setCheckAnswers(true)
	}

	function handlePlayAgain() {
		setPlayAgain((prevState) => {
			return !prevState
		})
		setCheckAnswers(false)
	}

	const arr =
		triviaArray.length &&
		triviaArray.map((obj, i) => {
			return (
				<TriviaPage
					key={i}
					question={obj.question}
					correctAnswer={obj.correctAnswer}
					choices={obj.choices}
					handleClicked={handleClicked}
					checkAnswers={checkAnswers}
					id={obj.id}
				/>
			)
		})

	return (
		<>
			{isQuizStarted ? (
				<div className="mainContentDivider">
					<div>{arr}</div>
					{checkAnswers ? (
						<div className="scoreContainer">
							<h3>
								You scored {isCorrect}/{triviaArray.length} correct answers
							</h3>
							<button onClick={handlePlayAgain}>Play Again</button>
						</div>
					) : (
						<Button
							handleCheckAnswers={handleCheckAnswers}
							correctAnswers={triviaArray.map((el) => el.correctAnswer)} //can pass correct answer instead of array of correct answers
						/>
					)}
				</div>
			) : (
				<TitlePage startQuiz={handleStartQuiz} />
			)}
		</>
	)
}

export default App
