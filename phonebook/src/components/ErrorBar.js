const ErrorBar = ({ message }) => {

    const error = {
        color: "red",
        background: "lightgrey",
        fontSize: 30,
        borderStyle: "solid",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }

    if (!message) {
        return null
    }

    return (
        <div style={error}>
            {message}
        </div>
    )
}

export default ErrorBar