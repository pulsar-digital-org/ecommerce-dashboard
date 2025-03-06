import { FileInput, XIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from './button'
import { Label } from './label'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import client, { ImageInterface } from '@/client/client'
import { useSession } from '@/hooks/use-session'

interface FileSelectProps {
	label: string
	isMulti?: boolean
	defaultImages?: ImageInterface[]
	onSelect: (images: string[]) => void
}

interface LocalFile extends ImageInterface {
	upload: Promise<ImageInterface | undefined>
}

const FileSelect = ({
	label,
	isMulti = false,
	defaultImages,
	onSelect,
}: FileSelectProps) => {
	const { token } = useSession()

	const [dragActive, setDragActive] = useState(false)
	const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
	const dragContainerRef = useRef<HTMLDivElement>(null)

	const [selectedFiles, setSelectedFiles] = useState<LocalFile[]>([])
	const [images, setImages] = useState<ImageInterface[]>(defaultImages ?? [])
	const inputRef = useRef<HTMLInputElement>(null)

	// Ref to track which files have been processed
	const processedFiles = useRef<Set<string>>(new Set())

	const handleFiles = (files: FileList) => {
		const newFiles = Array.from(files).map((file) => ({
			id: Math.random().toString(36).slice(2),
			url: URL.createObjectURL(file),
			name: file.name,
			size: file.size,
			upload: handleUpload(file),
			active: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		}))

		if (!isMulti) {
			// Revoke URLs for previously selected files when not multi-selecting
			selectedFiles.forEach((f) => URL.revokeObjectURL(f.url))
			setSelectedFiles(newFiles.slice(0, 1))
			// Clear previously uploaded images
			setImages([])
		} else {
			setSelectedFiles((prev) => [...prev, ...newFiles])
		}
	}

	const handleDrag = (e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		const rect = dragContainerRef.current?.getBoundingClientRect()
		if (rect) {
			setDragPosition({
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
			})
		}
		setDragActive(e.type === 'dragenter' || e.type === 'dragover')
	}

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault()
		setDragActive(false)
		if (e.dataTransfer.files?.length) {
			handleFiles(e.dataTransfer.files)
		}
	}

	const removeSelectedFile = (id: string) => {
		setSelectedFiles((prev) => {
			const newFiles = prev.filter((file) => file.id !== id)
			const removed = prev.find((f) => f.id === id)
			if (removed) URL.revokeObjectURL(removed.url)
			return newFiles
		})
	}

	const handleUpload = async (
		file: File
	): Promise<ImageInterface | undefined> => {
		try {
			const formData = new FormData()
			formData.append('file', file)

			const response = await client.api.images.$post(
				{ form: { file } },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
			const res = await response.json()

			return res.image
		} catch (err) {
			toast.error('Upload failed', { description: `${err}` })
			throw err // Ensure the promise rejects on error
		}
	}

	useEffect(() => {
		selectedFiles.forEach((file) => {
			// Only process files that haven't been handled yet
			if (processedFiles.current.has(file.id)) return
			processedFiles.current.add(file.id)

			file.upload
				.then((result) => {
					if (result) {
						// If multi is false, replace the current image; otherwise, append it
						if (!isMulti) {
							setImages([result])
						} else {
							setImages((prev) => [...prev, result])
						}
					}
					setSelectedFiles((prev) => {
						const newFiles = prev.filter((f) => f.id !== file.id)
						URL.revokeObjectURL(file.url)
						return newFiles
					})
				})
				.catch(() => {
					setSelectedFiles((prev) => {
						const newFiles = prev.filter((f) => f.id !== file.id)
						URL.revokeObjectURL(file.url)
						return newFiles
					})
				})
		})
	}, [selectedFiles, isMulti])

	useEffect(() => {
		onSelect(images.map((i) => i.id))
	}, [images, onSelect])

	return (
		<div className="space-y-2">
			<Label>{label}</Label>
			<div
				ref={dragContainerRef}
				onDragOver={handleDrag}
				onDrop={handleDrop}
				className={`relative overflow-hidden rounded-lg transition min-h-[200px] ${dragActive ? 'bg-muted-foreground/20' : 'border-muted'}`}
			>
				{dragActive && (
					<div
						className="absolute -translate-x-1/2 -translate-y-1/2 animate-pulse"
						style={{
							left: dragPosition.x,
							top: dragPosition.y,
							pointerEvents: 'none',
						}}
					>
						<div className="h-16 w-16 rounded-full bg-blue-500/20" />
						<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
							<div className="h-8 w-8 rounded-full bg-blue-500/40 animate-ping" />
						</div>
					</div>
				)}
				<Button
					variant="ghost"
					className="h-20 w-20 cursor-pointer border-2"
					onClick={() => inputRef.current?.click()}
				>
					<FileInput className="h-8 w-8" />
				</Button>
				<div className="flex flex-wrap gap-4">
					<div className="grid grid-cols-2 gap-4">
						{images?.map((image) => (
							<div
								key={image.id}
								className="relative flex flex-col justify-between bg-muted-foreground/10 rounded-lg items-center py-3 px-3 w-full gap-4"
							>
								<div className="flex justify-between w-full gap-4">
									<div className="flex flex-col overflow-hidden whitespace-nowrap">
										<h6 className="text-xs font-medium text-ellipsis overflow-hidden">
											{image.name}
										</h6>
										<p className="text-xs text-muted-foreground">
											{(image.size / 1024).toFixed(1)} KB
										</p>
									</div>
									<Button
										size="sm"
										className="h-8 w-8 rounded-full"
										onClick={() =>
											setImages((prev) =>
												prev.filter((file) => file.id !== image.id)
											)
										}
									>
										<XIcon className="h-4 w-4" />
									</Button>
								</div>
								<div className="rounded-md w-full overflow-hidden relative">
									<img
										src={image.url}
										alt={image.name}
										className="object-cover w-full h-full"
									/>
								</div>
							</div>
						))}
					</div>
					<div className="grid grid-cols-2 gap-4">
						{selectedFiles.map((file, index) => (
							<motion.div
								key={file.id}
								className="relative flex flex-col justify-between bg-muted-foreground/10 rounded-lg items-center py-3 px-3 w-full gap-4"
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.2, ease: [0.26, 1.44, 0.53, 0.97] }}
								exit={{ opacity: 0, scale: 0.8 }}
							>
								<div className="flex justify-between w-full gap-4">
									<div className="flex flex-col overflow-hidden whitespace-nowrap">
										<h6 className="text-xs font-medium text-ellipsis overflow-hidden">
											{file.name}
										</h6>
										<p className="text-xs text-muted-foreground">
											{(file.size / 1024).toFixed(1)} KB
										</p>
									</div>
									<Button
										size="sm"
										className="h-8 w-8 rounded-full"
										onClick={() => removeSelectedFile(file.id)}
									>
										<XIcon className="h-4 w-4" />
									</Button>
								</div>
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: 200 }}
									transition={{
										delay: index * 0.1,
										duration: 0.2,
										ease: [0.26, 1.44, 0.53, 0.97],
									}}
									className="rounded-md w-full overflow-hidden relative"
								>
									<div className="absolute inset-0 bg-black/50 flex items-center justify-center">
										<div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" />
									</div>
									<img
										src={file.url}
										alt={file.name}
										className="object-cover w-full h-full"
									/>
								</motion.div>
							</motion.div>
						))}
					</div>
					<input
						type="file"
						ref={inputRef}
						hidden
						multiple={isMulti}
						onChange={(e) => e.target.files && handleFiles(e.target.files)}
					/>
				</div>
			</div>
		</div>
	)
}

export default FileSelect
