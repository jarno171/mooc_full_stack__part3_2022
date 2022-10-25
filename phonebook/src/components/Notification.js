const Notification = ({ message }) => {

    const messageStyle = {
        color: 'green',
        fontStyle: 'italic',
        fontSize: 30
    }

    if (!message) {
        return null
    }

    return (
        <div style={messageStyle}>
            {message}
        </div>
    )
}

export default Notification