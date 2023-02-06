export default function TitlePage(props) {
	return (
		<section className="section">
			<h1 className="section--title">Quizzical</h1>
			<p className="section--text">
				A fun and quick Triva game to test your <strong>Computer</strong>{" "}
				knowledge
			</p>
			<button onClick={props.startQuiz}>Start Quiz</button>
		</section>
	)
}
