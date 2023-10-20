import { useState } from 'react'

const Statistics = ({ good, neutral, bad }) => {
  if (good === 0 && neutral === 0 && bad === 0) {
    return <div>No feedback given</div>
  }

  return (
    <table>
      <tbody>
        <StatisticsLine text="good" value={good} />
        <StatisticsLine text="neutral" value={neutral} />
        <StatisticsLine text="bad" value={bad} />
        <StatisticsLine text="all" value={good + neutral + bad} />
        <StatisticsLine
          text="average"
          value={(good - bad) / (good + bad + neutral)}
        />
        <StatisticsLine
          text="positive"
          value={String((100 * good) / (good + bad + neutral)) + ' %'}
        />
      </tbody>
    </table>
  )
}

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>
}

const StatisticsLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />

      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
