import {exp} from 'react-native/Libraries/Animated/src/Easing';
import {getChatEntities} from './queries';

export const emailValidator = (email) => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) {
    return 'Email cannot be empty.';
  }

  return '';
};

export const userValidator = async (user) => {
  let users = await getChatEntities();
  users = users.map((u) => u.entity_id);

  if (users.includes(user)) {
    return true;
  } else {
    return false;
  }
};

export const passwordValidator = (password) => {
  if (!password || password.length <= 0) {
    return 'Password cannot be empty.';
  }

  return '';
};

export const nameValidator = (name) => {
  if (!name || name.length <= 0) {
    return 'Name cannot be empty.';
  }

  return '';
};

export const getCurrentDateTime = () => {
  return new Date().toISOString().substring(0, 19).replace('T', ' ');
};

export const imagePickerOptions = {
  storageOptions: {
    skipBackup: true,
    path: 'ultrachat',
    privateDirectory: true,
  },
  quality: 0.3,
  maxHeight: 600,
  maxWidth: 800,
  // mediaType: 'photo',
};

export const api = 'http://192.168.1.153/ultra/';
