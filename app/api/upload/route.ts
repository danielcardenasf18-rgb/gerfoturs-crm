import { writeFile, mkdir } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string || 'docs'; // Default to docs

    if (!file) {
      return NextResponse.json({ error: "No se ha subido ningún archivo" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean filename to avoid issues
    const fileName = file.name.replace(/\s+/g, '-').toLowerCase();
    const uniqueFileName = `${Date.now()}-${fileName}`;
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', type);
    
    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });
    
    const uploadPath = path.join(uploadDir, uniqueFileName);
    console.log(`Intentando guardar archivo en: ${uploadPath}`);
    
    await writeFile(uploadPath, buffer);
    console.log(`Archivo guardado exitosamente: ${uniqueFileName}`);
    
    const fileUrl = `/uploads/${type}/${uniqueFileName}`;
    console.log(`URL generada: ${fileUrl}`);

    return NextResponse.json({ url: fileUrl });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ 
      error: "Error al subir el archivo", 
      details: error.message 
    }, { status: 500 });
  }
}
