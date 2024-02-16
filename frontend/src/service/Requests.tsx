import Swal from 'sweetalert2';

export const sendRequest = async (
  url: string,
  method: string,
  payload: any,
  text: string,
  icon: 'info' | 'success' | 'error' | 'warning' | 'question' | undefined
): Promise<any> => {
  try {
    Swal.fire({
      title: 'Processing...',
      text: text,
      icon: icon || 'info',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',                    
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    Swal.close();
    return data;
  } catch (error) {
    Swal.close();
    throw new Error('Something went wrong: ' + error);
  }
};
