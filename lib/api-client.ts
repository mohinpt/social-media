import { IImage } from "@/models/image";
import { IPost } from "@/models/post";
import { IVideo } from "@/models/video"

export type VideoFormData = Omit<IVideo, "_id">;

type FetchOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    body?: any,
    headers?: Record<string, string>
}

class ApiClient {
    private async fetch<T>(
        endpoint: string,
        options: FetchOptions = {}
    ): Promise<T> {
        const { method = "GET", body, headers = {} } = options

        const defaultHeaders = {
            "Content-Type": "application/json",
            ...headers
        }

        const response = await fetch(`/api${endpoint}`, {
            method,
            headers: defaultHeaders,
            body: body ? JSON.stringify(body) : undefined,

        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        return response.json();
    }

    async getVideos() {
        return this.fetch<IVideo[]>("/videos");
    }

    async getAVideo(id: string) {
        return this.fetch<IVideo>(`/videos/${id}`)
    }

    async createVideo(videoData: VideoFormData) {
        return this.fetch("/videos", {
            method: "POST",
            body: videoData,
        })
    }

    async updateVideo(id: string, updates: { title?: string, description: string }) {
        return this.fetch("/videos", {
            method: "PATCH",
            body: { id, ...updates }
        })
    }

    async deleteVideo(id: string) {
        return this.fetch("/videos", {
            method: "DELETE",
            body: { id }
        })
    }

    async getImages() {
        return this.fetch<IImage[]>("/images")
    }

    async getAnImage(id: string) {
        return this.fetch<IImage>(`/images/${id}`)
    }

    async createImage(data: IImage) {
        return this.fetch("/images", {
            method: "POST",
            body: data
        }
        )
    }

    async updateImage(id: string, updates: { title?: string, description?: string, imageUrl?: string }) {
        return this.fetch("/images", {
            method: "PUT",
            body: { id, ...updates }
        })
    }

    // Add this to your existing ApiClient class
    async getPosts() {
        return this.fetch<IPost[]>("/posts");
    }

    async getSearchPosts(query: string) {
        // Encodes the query to be safe for URLs
        const encoded = encodeURIComponent(query.trim());
        return this.fetch<IPost[]>(`/posts/search?q=${encoded}`);
    }

    async createPost(postData: { content: string; username: string;  media?: { type: 'image' | 'video'; url: string } }) {
        return this.fetch("/posts", {
            method: "POST",
            body: postData,
        });
    }

    async updatePost(id: string, content: string) {
        return this.fetch(`/posts/${id}`, {
            method: "PUT",
            body: { id, content }
        })
    }

    async deletePost(id: string){
        return this.fetch(`/posts/${id}`, {
            method: "DELETE",
        })
    }
}

export const apiClient = new ApiClient();