import { gql } from '@apollo/client';

export const GET_EXPENSES = gql`
   query {
    expenses {
      id
    card
    item
    amount
    date
    deductible
    }
  }
`;
export const DELETE_EXPENSE = gql`
  mutation deleteExpense($id: ID!) {
    deleteExpense(id: $id) {
      id
    }
  }
`;
export const ADD_EXPENSE = gql`
  mutation addExpense($expense: AddExpenseInput!) {
    addExpense(expense: $expense) {
      id
     card
     item
     amount
     date
     deductible
    }
  }
`;

export const AddExpenseInput = {
  // Define the shape of the AddProcessorInput object
  card: '',
  item: '',
  amount: false,
  date: "",
  deductible:"",
};

