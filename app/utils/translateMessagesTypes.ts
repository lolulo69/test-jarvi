export const translateMessagesTypes = (
  type: 'linkedinMessage' | 'linkedinInmail' | 'email'
) => {
  switch (type) {
    case 'linkedinMessage':
      return 'LinkedIn Message';
    case 'linkedinInmail':
      return 'LinkedIn InMail';
    case 'email':
      return 'Email';
    default:
      return 'Unknown';
  }
};
