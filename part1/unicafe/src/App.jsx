import { useState } from 'react'

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({ name, value }) => (
  <tr>
    <td>{name}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = ({ stats }) => {
  const all = stats.reduce((accum, curr) => (accum + curr.value), 0)

  if (all === 0) return "No feedback given"

  const average = stats.reduce((accum, curr) => (accum + curr.step * curr.value), 0) / all
  const positive = 100 * stats.reduce((accum, curr) => (accum + (curr.step > 0 ? curr.step * curr.value : 0)), 0) / all

  const moreStats = [
    { name: "all", value: all },
    { name: "average", value: average },
    { name: "positive", value: `${positive} %` },
  ]

  return (
    <table>
      <tbody>
        {stats.concat(moreStats).map(({ name, value }, i) => (
          <StatisticLine key={`${name}-${i}`} name={name} value={value} />
        ))}
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const stats = [
    { name: "good", value: good, step: 1 },
    { name: "neutral", value: neutral, step: 0 },
    { name: "bad", value: bad, step: -1 },
  ]

  return (
    <div>
      <h2>give feedback</h2>
      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setBad(bad + 1)} text="bad" />
      <h2>statistics</h2>
      <Statistics stats={stats} />
    </div>
  )
}

export default App