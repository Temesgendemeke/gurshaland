const parsePath = (public_url: string, bucket: string) => {
  return public_url.split(`/${bucket}/`)[1];
};

export default parsePath;
