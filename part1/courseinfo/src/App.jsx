const Header = ({ course }) => (
  <h1>{course}</h1>
)

const Part = ({ name, count }) => (
  <p>{name} {count}</p>
)

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((part, i) => (
        <Part key={`${part.name}-${part.exercises}-${i}`} name={part.name} count={part.exercises} />
      ))}
    </div>
  )
}

const Total = ({ parts }) => (
  <p>Number of exercises {parts.reduce((accum, curr) => (accum + curr.exercises), 0)}</p>
)

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App