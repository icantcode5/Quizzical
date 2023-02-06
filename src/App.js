import React from "react"
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

	console.log(decode)

	//helper function to combine correct answer and incorrect answers into one array and then shuffle the array in place.
	function combineAndShuffleArray(obj) {
		return obj.incorrect_answers
			.concat(obj.correct_answer)
			.map((value, i) => {
				return {
					option: decode(value),
					isHeld: false,
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
						return {
							...prevObj,
							question: decode(obj.question),
							correctAnswer: obj.correct_answer,
							id: nanoid(),
							choices: combineAndShuffleArray(obj),
						}
					})
				})
			})
			.catch((err) => console.log("error with state setting"))
	}, [playAgain])

	function handleStartQuiz() {
		setIsQuizStarted(true)
	}

	function handleClicked(btnOption, objId) {
		console.log(objId)

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

	function handleCheckAnswers(correctAnswers) {
		let correct = 0

		triviaArray.forEach((obj) => {
			obj.choices.forEach((obj2) => {
				if (correctAnswers.includes(obj2.option) && obj2.isHeld) {
					correct += 1
				}
			})
		})

		setCheckAnswers(true)
		setIsCorrect(correct)
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
							correctAnswer={triviaArray.map((el) => el.correctAnswer)} //can pass correct answer instead of array of correct answers
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
