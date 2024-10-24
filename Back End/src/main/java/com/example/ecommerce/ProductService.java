package com.example.ecommerce.service;

import com.example.ecommerce.model.Product;
import com.example.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @PostConstruct
    public void init() {
        // Add sample products if the database is empty
        if (productRepository.count() == 0) {
            productRepository.save(new Product("Product 1", 19.99, "https://via.placeholder.com/250x200.png?text=Product+1"));
            productRepository.save(new Product("Product 2", 29.99, "https://via.placeholder.com/250x200.png?text=Product+2"));
            productRepository.save(new Product("Product 3", 39.99, "https://via.placeholder.com/250x200.png?text=Product+3"));
            productRepository.save(new Product("Product 4", 49.99, "https://via.placeholder.com/250x200.png?text=Product+4"));
        }
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }
}