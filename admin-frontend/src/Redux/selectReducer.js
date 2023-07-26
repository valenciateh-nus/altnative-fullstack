const selectReducer = (state, {type, data}) => {
  switch(type){
    case ADD:
      return state.push(data);
    case REMOVE:
      return state.filter((val) => val != data);
    default:
      return state;
  }
}

export default selectReducer;