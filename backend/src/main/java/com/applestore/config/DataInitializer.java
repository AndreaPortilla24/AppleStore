package com.applestore.config;

import com.applestore.entity.Producto;
import com.applestore.entity.Usuario;
import com.applestore.repository.ProductoRepository;
import com.applestore.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsuarios();
        seedProductos();
    }

    private void seedUsuarios() {
        if (usuarioRepository.count() > 0) return;

        usuarioRepository.saveAll(List.of(
            Usuario.builder().nombre("Admin").apellido("AppleStore").correo("admin@applestore.com")
                .password(passwordEncoder.encode("admin123")).rol(Usuario.Rol.ADMINISTRADOR).build(),
            Usuario.builder().nombre("Carlos").apellido("Técnico").correo("tecnico@applestore.com")
                .password(passwordEncoder.encode("empleado123")).rol(Usuario.Rol.EMPLEADO).build(),
            Usuario.builder().nombre("Juan").apellido("García").correo("cliente@applestore.com")
                .password(passwordEncoder.encode("cliente123")).rol(Usuario.Rol.CLIENTE).build()
        ));
        System.out.println("✅ Usuarios demo creados");
    }

    private void seedProductos() {
        if (productoRepository.count() > 0) return;

        productoRepository.saveAll(List.of(
            Producto.builder().nombre("iPhone 15 Pro").categoria("iPhone").modelo("A3101")
                .estado(Producto.Estado.ACTIVO).invDisponible(50).invSeparado(5)
                .precio(new BigDecimal("4299000"))
                .imagenUrl("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg")
                .descripcion("El iPhone más avanzado con chip A17 Pro y cámara de titanio.").build(),

            Producto.builder().nombre("iPhone 15").categoria("iPhone").modelo("A3090")
                .estado(Producto.Estado.ACTIVO).invDisponible(80).invSeparado(0)
                .precio(new BigDecimal("3299000"))
                .imagenUrl("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-pink?wid=5120&hei=2880&fmt=p-jpg")
                .descripcion("iPhone 15 con Dynamic Island y cámara de 48 MP.").build(),

            Producto.builder().nombre("MacBook Air 15\"").categoria("Mac").modelo("MQKV3LL/A")
                .estado(Producto.Estado.ACTIVO).invDisponible(30).invSeparado(2)
                .precio(new BigDecimal("6499000"))
                .imagenUrl("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=904&hei=840&fmt=jpeg&qlt=90")
                .descripcion("MacBook Air con chip M2, pantalla Liquid Retina 15\".").build(),

            Producto.builder().nombre("MacBook Pro 14\"").categoria("Mac").modelo("MPHF3LL/A")
                .estado(Producto.Estado.ACTIVO).invDisponible(20).invSeparado(1)
                .precio(new BigDecimal("8999000"))
                .imagenUrl("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202301?wid=904&hei=840&fmt=jpeg&qlt=90")
                .descripcion("MacBook Pro con chip M3 Pro, pantalla ProMotion 120Hz.").build(),

            Producto.builder().nombre("iPad Pro 12.9\"").categoria("iPad").modelo("MNXR3LL/A")
                .estado(Producto.Estado.ACTIVO).invDisponible(40).invSeparado(3)
                .precio(new BigDecimal("4999000"))
                .imagenUrl("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-13-select-wifi-spacegray-202210?wid=940&hei=1112&fmt=jpeg&qlt=90")
                .descripcion("iPad Pro con chip M2, pantalla Liquid Retina XDR.").build(),

            Producto.builder().nombre("iPad Air").categoria("iPad").modelo("MME23LL/A")
                .estado(Producto.Estado.ACTIVO).invDisponible(60).invSeparado(0)
                .precio(new BigDecimal("2699000"))
                .imagenUrl("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-select-wifi-blue-202203?wid=940&hei=1112&fmt=jpeg&qlt=90")
                .descripcion("iPad Air con chip M1, pantalla Liquid Retina 10.9\".").build(),

            Producto.builder().nombre("Apple Watch Series 9").categoria("Watch").modelo("MRXC3LL/A")
                .estado(Producto.Estado.ACTIVO).invDisponible(70).invSeparado(0)
                .precio(new BigDecimal("1899000"))
                .imagenUrl("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MR9A3ref_VW_34FR+watch-45-alum-midnight-nc-9s_VW_34FR_WF_CO+watch-face-45-aluminum-midnight-9s_VW_34FR?wid=750&hei=712&fmt=jpeg&qlt=90")
                .descripcion("Apple Watch Series 9 con chip S9 y pantalla Always-On.").build(),

            Producto.builder().nombre("AirPods Pro 2da Gen").categoria("AirPods").modelo("MTJV3LL/A")
                .estado(Producto.Estado.ACTIVO).invDisponible(100).invSeparado(0)
                .precio(new BigDecimal("1299000"))
                .imagenUrl("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=2000&hei=2000&fmt=jpeg&qlt=95")
                .descripcion("AirPods Pro con cancelación activa de ruido y audio adaptativo.").build(),

            Producto.builder().nombre("Apple TV 4K").categoria("TV & Home").modelo("MN873LL/A")
                .estado(Producto.Estado.ACTIVO).invDisponible(35).invSeparado(0)
                .precio(new BigDecimal("799000"))
                .imagenUrl("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/apple-tv-4k-hero-select-202210?wid=854&hei=782&fmt=jpeg&qlt=90")
                .descripcion("Apple TV 4K con chip A15 Bionic y soporte HDR10+.").build(),

            Producto.builder().nombre("HomePod mini").categoria("TV & Home").modelo("MY5H2LL/A")
                .estado(Producto.Estado.ACTIVO).invDisponible(45).invSeparado(0)
                .precio(new BigDecimal("699000"))
                .imagenUrl("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/homepod-mini-select-yellow-202210?wid=1228&hei=1228&fmt=jpeg&qlt=90")
                .descripcion("HomePod mini con audio 360° y chip S5.").build()
        ));
        System.out.println("✅ Productos demo creados");
    }
}
