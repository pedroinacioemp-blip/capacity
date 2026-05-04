export async function uploadImageToCloudinary(imageUrl: string): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary não configurado. Defina NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME e NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.');
  }

  const form = new FormData();
  form.append('file', imageUrl);
  form.append('upload_preset', uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: form,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error?.message ?? 'Falha no upload do Cloudinary.');
  }

  return result.secure_url;
}
